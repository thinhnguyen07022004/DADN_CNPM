import React, { useEffect, useState, memo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import OTPTextView from "react-native-otp-textinput";
import { useCurrentApp } from "@/context/app.context";
import { APP_COLOR } from "@/utils/constant";
import { getDoorAPI, remoteControllerAPI, updateDoorAPI, updatePasswordAPI } from "@/utils/api";
import Toast from "react-native-root-toast";
import LoadingOverlay from "@/components/loading/overlay";
import { router } from "expo-router";
import ButtonFunction from "@/components/door/button.function";

const formatFeedData = (data: IDoor): IDoor => ({
    ...data,
    formattedCreatedAt: new Date(data.createdAt).toLocaleString(),
    formattedExpiration: new Date(data.updatedAt).toLocaleString(),
});

const FeedItem = memo(({ item }: { item: IDoor }) => (
    <View style={styles.card}>
        <View style={styles.infoRow}>
            <FontAwesome5 name="door-open" size={20} color={APP_COLOR.ORANGE} style={styles.icon} />
            <Text style={styles.infoLabel}>Password</Text>
            <Text style={styles.infoValueBlue}>{item.doorPassword}</Text>
        </View>
        <View style={styles.infoRow}>
            <FontAwesome5 name="clock" size={20} color={APP_COLOR.GREEN} style={styles.icon} />
            <Text style={styles.infoLabel}>Created At</Text>
            <Text style={styles.infoValueGreen}>{item.formattedCreatedAt}</Text>
        </View>
        <View style={styles.infoRow}>
            <FontAwesome5 name="hourglass-end" size={20} color={APP_COLOR.GREEN} style={styles.icon} />
            <Text style={styles.infoLabel}>Updated At</Text>
            <Text style={styles.infoValueGreen}>{item.formattedExpiration}</Text>
        </View>
    </View>
));

FeedItem.displayName = "FeedItem";

const DoorDataPage = () => {
    const { config } = useCurrentApp();
    const [doorData, setDoorData] = useState<IDoor | undefined>();
    const [passWord, setPassWord] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"view" | "reset" | "control">("view");
    const [isDoorOpen, setIsDoorOpen] = useState(false);
    const [showOpenInput, setShowOpenInput] = useState(false);
    const [showResetInput, setShowResetInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const otpRef = useRef<any>(null);
    const resetOtpRef = useRef<any>(null);
    const [isUserInput, setIsUserInput] = useState(true);

    const showToast = (message: string, isError = false) =>
        Toast.show(message, {
            duration: Toast.durations.LONG,
            textColor: "#fff",
            backgroundColor: isError ? "red" : APP_COLOR.GREEN,
            opacity: 1,
        });

    const updateDoorData = async () => {
        try {
            const res = await getDoorAPI(config!.id);
            console.log("updateDoorData response:", JSON.stringify(res, null, 2));
            if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
                const formattedData = formatFeedData(res.data[0]);
                setDoorData(formattedData);
                setPassWord(formattedData.doorPassword || "");
            } else {
                showToast("No door data found", true);
            }
        } catch (err) {
            showToast("Failed to load door data", true);
        }
    };

    useEffect(() => {
        const fetchDoorData = async () => {
            setLoading(true);
            if (!config?.id || !config?.iotApiKey || !config?.iotName) {
                showToast("Account not configured", true);
                setLoading(false);
                return;
            }
            try {
                const res = await getDoorAPI(config.id);
                if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
                    const formattedData = formatFeedData(res.data[0]);
                    setDoorData(formattedData);
                    setPassWord(formattedData.doorPassword || "");
                    if (!formattedData.doorPassword) {
                        showToast("No door password set", true);
                        return;
                    }
                    try {
                        await updatePasswordAPI(formattedData.doorPassword, config.iotName, config.iotApiKey);
                    } catch (apiError) {
                        showToast("Failed to update password", true);
                    }
                } else {
                    showToast("No door data found", true);
                }
            } catch (err) {
                showToast("Failed to load door data", true);
            } finally {
                setLoading(false);
            }
        };
        fetchDoorData();
    }, [config?.id, config?.iotApiKey, config?.iotName]);

    const sendApiRequest = async (value: string) => {
        if (!config?.id || !config?.iotApiKey || !config?.iotName) {
            showToast("Account not configured", true);
            router.navigate("/(tabs)/configuration");
            return false;
        }
        try {
            const res = await remoteControllerAPI(value, config.iotName, config.iotApiKey);
            return true;
        } catch (err: any) {
            showToast(`API request failed: ${err.message}`, true);
            return false;
        }
    };

    const handleOpenCloseDoor = async () => {
        setActionLoading(true);
        try {
            const action = isDoorOpen ? "5" : "4";
            const success = await sendApiRequest(action);
            if (success) {
                if (isDoorOpen) {
                    setIsDoorOpen(false);
                    setShowOpenInput(false);
                    showToast("Door closed successfully");
                } else {
                    setShowOpenInput(true);
                    setOtp("");
                }
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleOtpChange = async (text: string) => {
        setOtp(text);
        if (isUserInput && text.length > 0) {
            const success = await sendApiRequest(text[text.length - 1]);
        }
        if (text.length === 6) {
            if (text === doorData?.doorPassword) {
                setIsDoorOpen(true);
                setShowOpenInput(false);
                setOtp("");
                showToast("Door opened successfully");
            } else {
                showToast("Incorrect password", true);
                setShowOpenInput(false);
                setOtp("");
            }
        }
    };

    const handlePasswordUpdate = async (password: string, isOTP = false) => {
        if (!config?.id || (isOTP && (!config?.iotApiKey || !config?.iotName))) {
            showToast("Account not configured", true);
            return false;
        }
        if (!password.trim()) {
            showToast("Password cannot be empty", true);
            return false;
        }
        if (!/^\d{6}$/.test(password)) {
            showToast("Password must be 6 digits", true);
            return false;
        }
        if (password === doorData?.doorPassword) {
            showToast("New password cannot be same as current", true);
            return false;
        }
        try {
            const response = await updateDoorAPI(config.id, password);
            showToast("Password updated successfully");
            await updateDoorData();
            return true;
        } catch (err: any) {
            showToast(`Failed to update password: ${err.message}`, true);
            return false;
        }
    };

    const handleNewPasswordChange = async (text: string) => {
        setNewPassword(text);
        if (isUserInput && text.length > 0) {
            const success = await sendApiRequest(text[text.length - 1]);
        }
        if (text.length === 6) {
            setActionLoading(true);
            try {
                if (await handlePasswordUpdate(text, true)) {
                    setShowResetInput(false);
                    setNewPassword("");
                    resetOtpRef.current?.clear();
                }
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleResetPassword = async () => {
        setResetLoading(true);
        try {
            if (await handlePasswordUpdate(newPassword)) {
                setActiveTab("view");
            }
        } finally {
            setResetLoading(false);
        }
    };

    const handleFunctionButton = async (action: string, type: "open" | "reset") => {
        const success = await sendApiRequest(action);
        setIsUserInput(false);

        if (type === "open") {
            if (action === "#") {
                setShowOpenInput(false);
                setOtp("");
                otpRef.current?.clear();
            } else if (action === "*") {
                setOtp("");
                otpRef.current?.clear();
            } else if (action === "-") {
                const newOtp = otp.slice(0, -1);
                setOtp(newOtp);
                otpRef.current?.setValue(newOtp);
            }
        } else if (type === "reset") {
            if (action === "#") {
                setShowResetInput(false);
                setNewPassword("");
                resetOtpRef.current?.clear();
            } else if (action === "*") {
                setNewPassword("");
                resetOtpRef.current?.clear();
            } else if (action === "-") {
                const newPasswordValue = newPassword.slice(0, -1);
                setNewPassword(newPasswordValue);
                resetOtpRef.current?.setValue(newPasswordValue);
            }
        }
        setIsUserInput(true);
    };

    const handleStartResetPassword = async () => {
        setActionLoading(true);
        try {
            const success = await sendApiRequest("6");
            if (success) {
                setShowResetInput(true);
                setNewPassword("");
                resetOtpRef.current?.clear();
            }
        } finally {
            setActionLoading(false);
        }
    };

    const renderViewTab = () =>
        loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
        ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
        ) : doorData ? (
            <FeedItem item={doorData} />
        ) : (
            <Text style={styles.noDataText}>No data to display</Text>
        );

    const renderResetTab = () => (
        <View style={styles.resetContainer}>
            <Text style={styles.resetTitle}>Reset Door Password</Text>
            <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter 6-digit password"
                placeholderTextColor="#B0BEC5"
                secureTextEntry
                keyboardType="numeric"
                maxLength={6}
            />
            <TouchableOpacity
                style={[styles.resetButton, resetLoading && styles.resetButtonDisabled]}
                onPress={handleResetPassword}
                disabled={resetLoading}
            >
                <Text style={styles.resetButtonText}>{resetLoading ? "Updating..." : "Update Password"}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderControlTab = () => (
        <View style={styles.controlContainer}>
            <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: isDoorOpen ? "#FF5722" : APP_COLOR.GREEN }]}
                onPress={handleOpenCloseDoor}
                disabled={actionLoading}
            >
                <Text style={styles.actionButtonText}>{isDoorOpen ? "Close Door" : "Open Door"}</Text>
            </TouchableOpacity>
            {showOpenInput && (
                <View style={styles.otpContainer}>
                    <Text style={styles.otpTitle}>Enter password to open door</Text>
                    <OTPTextView
                        ref={otpRef}
                        handleTextChange={handleOtpChange}
                        inputCount={6}
                        inputCellLength={1}
                        tintColor={APP_COLOR.GREEN}
                        textInputStyle={{
                            borderWidth: 1,
                            borderColor: APP_COLOR.GREY,
                            borderBottomWidth: 1,
                            borderRadius: 5,
                            // @ts-ignore:next-line
                            color: APP_COLOR.GREEN,
                        }}
                    />
                    <ButtonFunction onPress={(action: string) => handleFunctionButton(action, "open")} />
                </View>
            )}
            <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#2196F3" }]}
                onPress={handleStartResetPassword}
                disabled={actionLoading}
            >
                <Text style={styles.actionButtonText}>Reset Password (OTP)</Text>
            </TouchableOpacity>
            {showResetInput && (
                <View style={styles.otpContainer}>
                    <Text style={styles.otpTitle}>Enter new password</Text>
                    <OTPTextView
                        ref={resetOtpRef}
                        handleTextChange={handleNewPasswordChange}
                        inputCount={6}
                        inputCellLength={1}
                        tintColor={APP_COLOR.GREEN}
                        defaultValue={newPassword}
                        textInputStyle={{
                            borderWidth: 1,
                            borderColor: APP_COLOR.GREY,
                            borderBottomWidth: 1,
                            borderRadius: 5,
                            // @ts-ignore:next-line
                            color: APP_COLOR.GREEN,
                        }}
                    />
                    <ButtonFunction onPress={(action: string) => handleFunctionButton(action, "reset")} />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Door Control</Text>
            <View style={styles.tabContainer}>
                {["view", "reset", "control"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabButton, activeTab === tab && styles.tabActive]}
                        onPress={() => setActiveTab(tab as "view" | "reset" | "control")}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                            {tab === "view" ? "View Info" : tab === "reset" ? "Reset Password" : "Control"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {activeTab === "view" ? renderViewTab() : activeTab === "reset" ? renderResetTab() : renderControlTab()}
            {loading && <LoadingOverlay />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20, backgroundColor: "#F5F5F5" },
    title: { fontSize: 22, color: APP_COLOR.GREEN, fontWeight: "bold", marginLeft: 16, marginBottom: 16 },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    icon: { width: 30, textAlign: "center" },
    infoLabel: { flex: 1, fontSize: 14, color: "#555" },
    infoValueBlue: { fontSize: 16, fontWeight: "bold", color: APP_COLOR.ORANGE },
    infoValueGreen: { fontSize: 16, fontWeight: "bold", color: "#388E3C" },
    loader: { marginTop: 20 },
    noDataText: { fontSize: 16, color: "#555", textAlign: "center", marginTop: 20 },
    errorText: { fontSize: 16, color: "#FFEBEE", textAlign: "center", marginTop: 20 },
    tabContainer: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: "#eee",
        borderRadius: 10,
        overflow: "hidden",
        gap: 5,
    },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: APP_COLOR.GREY, borderRadius: 10 },
    tabActive: { backgroundColor: APP_COLOR.GREEN },
    tabText: { fontSize: 18, color: "#333" },
    tabTextActive: { color: "#FFF", fontWeight: "bold" },
    resetContainer: { paddingHorizontal: 16, marginTop: 20 },
    resetTitle: { fontSize: 18, color: APP_COLOR.GREEN, fontWeight: "bold", marginBottom: 16 },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: "#333",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#B0BEC5",
    },
    resetButton: { backgroundColor: APP_COLOR.GREEN, borderRadius: 8, padding: 12, alignItems: "center" },
    resetButtonDisabled: { backgroundColor: "#B0BEC5", opacity: 0.7 },
    resetButtonText: { fontSize: 16, color: "#FFF", fontWeight: "bold" },
    controlContainer: { paddingHorizontal: 16, marginTop: 20, alignItems: "center" },
    actionButton: {
        width: "80%",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonText: { fontSize: 18, fontWeight: "600", color: "#fff" },
    otpContainer: {
        width: "100%",
        padding: 20,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    otpTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10, textAlign: "center" },
});

export default DoorDataPage;