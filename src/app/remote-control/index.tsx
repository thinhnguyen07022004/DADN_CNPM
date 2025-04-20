import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Toast from "react-native-root-toast";
import { useCurrentApp } from "@/context/app.context";
import { getDoorAPI, remoteControllerAPI, updatePasswordAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";
import LoadingOverlay from "@/components/loading/overlay";

const RemoteControlScreen = () => {
    const { config } = useCurrentApp();
    const [loading, setLoading] = useState(false);
    const [doorData, setDoorData] = useState<IDoor | undefined>();
    const [passWord, setPassWord] = useState("");


    const formatFeedData = (data: IDoor): IDoor => ({
        ...data,
        formattedCreatedAt: new Date(data.createdAt).toLocaleString(),
        formattedExpiration: new Date(data.updatedAt).toLocaleString(),
    });

    const showToast = (message: string, isError = false) =>
        Toast.show(message, {
            duration: Toast.durations.LONG,
            textColor: "#fff",
            backgroundColor: isError ? "red" : APP_COLOR.GREEN,
            opacity: 1,
        });

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
                        const res = await updatePasswordAPI(formattedData.doorPassword, config.iotName, config.iotApiKey);
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

    const handleButtonPress = async (value: string, action: string) => {
        if (!config?.iotName || !config?.iotApiKey) {
            Toast.show("User has not configured account.", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }

        setLoading(true);
        try {
            await remoteControllerAPI(value, config.iotName, config.iotApiKey);
            Toast.show(`Command sent successfully: ${action}`, {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "#4CAF50",
                opacity: 1,
            });
        } catch (err: any) {
            Toast.show(`Error sending command: ${err.message}`, {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Remote Control</Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: APP_COLOR.GREEN }]}
                onPress={() => handleButtonPress("1", "Show light")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Show Light</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#FF5722" }]}
                onPress={() => handleButtonPress("2", "Show temperature")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Show Temperature</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#2196F3" }]}
                onPress={() => handleButtonPress("3", "Show door password")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Show Door Password</Text>
            </TouchableOpacity>
            {loading && <LoadingOverlay />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 32,
    },
    button: {
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
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
    },
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
        width: "90%",
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
    noDataText: { fontSize: 16, color: "#555", textAlign: "center", marginVertical: 20 },
});

export default RemoteControlScreen;