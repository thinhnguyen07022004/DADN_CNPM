import React, { useEffect, useState, memo } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useCurrentApp } from "@/context/app.context";
import { APP_COLOR } from "@/utils/constant";
import { getDoorAPI, updateDoorAPI } from "@/utils/api";
import Toast from "react-native-root-toast";

interface IDoor {
    _id: string;
    deviceId: string;
    configId: string;
    doorPassword: string;
    createdAt: string;
    updatedAt: string;
    formattedCreatedAt?: string;
    formattedExpiration?: string;
}

const formatFeedData = (data: IDoor[]): IDoor[] => {
    return data.map((item) => ({
        ...item,
        formattedCreatedAt: new Date(item.createdAt).toLocaleString(),
        formattedExpiration: new Date(item.updatedAt).toLocaleString(),
    }));
};

const FeedItem = memo(({ item }: { item: IDoor }) => (
    <View style={styles.card}>
        <View style={styles.infoRow}>
            <FontAwesome5 name="door-open" size={20} color={APP_COLOR.ORANGE} style={styles.icon} />
            <Text style={styles.infoLabel}>Pass Word</Text>
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
    const [doorData, setDoorData] = useState<IDoor[]>([]);
    const [allDoorData, setAllDoorData] = useState<IDoor[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"view" | "reset">("view");
    const [newPassword, setNewPassword] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    const itemsPerPage = 50;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            if (!config?.id) {
                Toast.show("Người dùng chưa cấu hình tài khoản", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: "red",
                    opacity: 1,
                });
                setLoading(false);
                return;
            }
            try {
                const res = await getDoorAPI(config?.id);
                const formatted = Array.isArray(res) ? formatFeedData(res) : [];
                setAllDoorData(formatted);
                setDoorData(formatted.slice(0, itemsPerPage));
            } catch (err) {
                Toast.show("Không thể tải dữ liệu cửa. Vui lòng kiểm tra kết nối.", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: "red",
                    opacity: 1,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleResetPassword = async () => {
        if (!config?.id) {
            Toast.show("Người dùng chưa cấu hình tài khoản", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }

        if (!newPassword.trim()) {
            Toast.show("Vui lòng nhập mật khẩu mới", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }

        if (!/^\d{6}$/.test(newPassword)) {
            Toast.show("Vui lòng nhập mật khẩu phải là 6 chữ số", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }

        const currentPassword = allDoorData.length > 0 ? allDoorData[0].doorPassword : null;
        if (currentPassword && newPassword === currentPassword) {
            Toast.show("Mật khẩu mới không được trùng với mật khẩu hiện tại", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }

        try {
            setResetLoading(true);
            await updateDoorAPI(config.id, newPassword);
            Toast.show("Cập nhật mật khẩu cửa thành công!", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: APP_COLOR.GREEN,
                opacity: 1,
            });
            setNewPassword("");
            const res = await getDoorAPI(config.id);
            const formatted = Array.isArray(res) ? formatFeedData(res) : [];
            setAllDoorData(formatted);
            setDoorData(formatted.slice(0, itemsPerPage));
        } catch (err: any) {
            Toast.show(`Lỗi khi cập nhật mật khẩu: ${err.message}`, {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
        } finally {
            setActiveTab("view");
            setResetLoading(false);
        }
    };

    const renderviewTab = () => {
        return loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
        ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
        ) : doorData.length > 0 ? (
            <FlatList
                data={doorData}
                renderItem={({ item }) => <FeedItem item={item} />}
                keyExtractor={(item) => item._id}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loadingMore ? (
                        <ActivityIndicator size="small" color="#FFFFFF" style={styles.loaderMore} />
                    ) : <View style={{ height: 20 }} />
                }
            />
        ) : (
            <Text style={styles.noDataText}>Không có dữ liệu cửa để hiển thị.</Text>
        );
    };

    const renderresetTab = () => {
        return (
            <View style={styles.resetContainer}>
                <Text style={styles.resetTitle}>Reset door's password</Text>
                <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Please enter 6 digit password"
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
                    <Text style={styles.resetButtonText}>
                        {resetLoading ? "Updating..." : "Update Password"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Door Controls</Text>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "view" && styles.tabActive]}
                    onPress={() => setActiveTab("view")}
                >
                    <Text style={[styles.tabText, activeTab === "view" && styles.tabTextActive]}>View Information</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "reset" && styles.tabActive]}
                    onPress={() => setActiveTab("reset")}
                >
                    <Text style={[styles.tabText, activeTab === "reset" && styles.tabTextActive]}>Reset Password</Text>
                </TouchableOpacity>
            </View>

            {activeTab === "view" ? renderviewTab() : renderresetTab()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    title: {
        fontSize: 22,
        color: APP_COLOR.GREEN,
        fontWeight: "bold",
        marginLeft: 16,
        marginBottom: 16,
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
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F8F8F8",
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    icon: {
        width: 30,
        textAlign: "center",
    },
    infoLabel: {
        flex: 1,
        fontSize: 14,
        color: "#555",
    },
    infoValueBlue: {
        fontSize: 16,
        fontWeight: "bold",
        color: APP_COLOR.ORANGE,
    },
    infoValueGreen: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#388E3C",
    },
    loader: {
        marginTop: 20,
    },
    loaderMore: {
        marginVertical: 10,
    },
    noDataText: {
        fontSize: 16,
        color: "#FFFFFF",
        textAlign: "center",
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#FFEBEE",
        textAlign: "center",
        marginTop: 20,
    },
    tabContainer: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: "#eee",
        borderRadius: 10,
        overflow: "hidden",
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: APP_COLOR.GREY,
    },
    tabActive: {
        backgroundColor: APP_COLOR.GREEN,
    },
    tabText: {
        fontSize: 14,
        color: "#333",
    },
    tabTextActive: {
        color: "#FFF",
        fontWeight: "bold",
    },
    resetContainer: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    resetTitle: {
        fontSize: 18,
        color: APP_COLOR.GREEN,
        fontWeight: "bold",
        marginBottom: 16,
    },
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
    resetButton: {
        backgroundColor: APP_COLOR.GREEN,
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
    },
    resetButtonDisabled: {
        backgroundColor: "#B0BEC5",
        opacity: 0.7,
    },
    resetButtonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "bold",
    },
});

export default DoorDataPage;