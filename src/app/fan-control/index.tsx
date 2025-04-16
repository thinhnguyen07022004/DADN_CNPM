import React, { useEffect, useState } from "react";
import { View, Text, Switch, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert, } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Slider from "@react-native-community/slider";
import ShareButton from "@/components/button/share.button";
import Thermometer from "@/components/fancontrol/themometer.control";
import { useCurrentApp } from "@/context/app.context";
import { fanControllerAPI, fetchSingleTemperatureFeedAPI, getFanAPI, updateFanAPI } from "@/utils/api";
import Toast from "react-native-root-toast";

interface IFanOn {
    intensity: number;
    threshold: number;
    _id: string;
}

const FanConfigScreen = () => {
    const { config } = useCurrentApp();
    const [fanLevel, setFanLevel] = useState(0);
    const [tempRes, setTemRes] = useState(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAutomatic, setIsAutomatic] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [fanOns, setFanOns] = useState<IFanOn[]>([]);
    const [fanConfig, setFanConfig] = useState<IFan | null>(null);

    useEffect(() => {
        if (config?.iotName && config?.iotApiKey && config?.id) {
            const fetchData = async () => {
                try {
                    const [tempRes] = await Promise.all([
                        fetchSingleTemperatureFeedAPI(config.iotName, config.iotApiKey, 1),
                    ]);
                    setTemRes(parseFloat(tempRes[0].value));
                } catch (err) {
                    console.error("Fetch feed error:", err);
                }
            };

            const fetchFanData = async () => {
                try {
                    const resFanList = await getFanAPI(config.id);
                    const validFanConfig = Array.isArray(resFanList) ? resFanList
                        .filter((fan: IFan) => fan.fanOns && fan.fanOns.length > 0)
                        .sort(
                            (a: IFan, b: IFan) =>
                                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                        )[0] : null;

                    if (validFanConfig) {
                        setFanConfig(validFanConfig);
                        setIsAutomatic(validFanConfig.controlledMode === "Automatic");
                        setFanOns(validFanConfig.fanOns || []);
                    } else {
                        setFanConfig(null);
                        setFanOns([]);
                    }
                } catch (err) {
                    console.error("Fetch fan config error:", err);
                    setError("Failed to fetch fan configuration");
                }
            };

            fetchData();
            fetchFanData();

            // const interval = setInterval(() => {
            //     fetchData();
            // }, 5000);
            // return () => clearInterval(interval)
        }
    }, [config?.iotName, config?.iotApiKey, config?.id]);

    const toggleAutomatic = () => {
        setIsAutomatic((prev) => !prev);
    };

    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    const updateFanOn = (index: number, key: "intensity" | "threshold", value: string) => {
        const updated = [...fanOns];
        updated[index][key] = parseInt(value) || 0;
        setFanOns(updated);
    };

    const addFanOn = () => {
        setFanOns((prev) => [...prev, { intensity: 0, threshold: 0, _id: "" }]);
    };

    const removeFanOn = (index: number) => {
        setFanOns((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateConfigFan = async () => {
        if (!config?.id) {
            Toast.show("Người dùng chưa cấu hình tài khoản", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }
        const controlledMode = "Automatic";
        const fanOnsData = fanOns.map(({ intensity, threshold }) => ({
            intensity: intensity.toString(),
            threshold: threshold.toString(),
        }));

        try {
            setLoading(true);
            await updateFanAPI(config?.id, controlledMode, fanOnsData);
            setIsEditing(false);
            Toast.show("Cập nhật cấu hình quạt thành công!", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: APP_COLOR.GREEN,
                opacity: 1,
            });
        } catch (err) {
            console.error("Update fan config error:", err);
            Toast.show("Không thể cập nhật cấu hình quạt.", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleControllerFan = async () => {
        if (!config?.iotApiKey && !config?.iotName) {
            Toast.show("Người dùng chưa cấu hình tài khoản", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }
        const value = `${"2:"}${fanLevel}`;
        console.log("Fan level:", value);
        try {
            setLoading(true);
            await fanControllerAPI(value, config?.iotName, config?.iotApiKey);
            setIsEditing(false);
            Toast.show(`Bật quạt thành công với cường độ là ${fanLevel}%.`, {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: APP_COLOR.GREEN,
                opacity: 1,
            });
        } catch (err) {
            console.error("Update fan config error:", err);
            Toast.show("Lỗi không bật được quạt. Hãy thử lại sau.", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: APP_COLOR.GREEN,
                opacity: 1,
            });
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => (
        <View>
            <View style={styles.rowContainer}>
                <View style={styles.fanCard}>
                    <Text style={styles.title}>Mức độ quạt</Text>
                    <AnimatedCircularProgress
                        size={120}
                        width={10}
                        fill={fanLevel}
                        tintColor={APP_COLOR.GREEN}
                        backgroundColor="#eee"
                        rotation={0}
                        lineCap="round"
                    >
                        {() => (
                            <Text style={styles.percentageText}>{fanLevel}%</Text>
                        )}
                    </AnimatedCircularProgress>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={fanLevel}
                        minimumTrackTintColor={APP_COLOR.GREEN}
                        maximumTrackTintColor="#B0BEC5"
                        onValueChange={(val) => setFanLevel(val)}
                    />
                    <ShareButton
                        loading={loading}
                        title={fanLevel === 0 ? "Tắt quạt" : "Bật quạt"}
                        icon={<FontAwesome5 name="fan" size={18} color="#fff" />}
                        onPress={() => handleControllerFan()}
                        textStyle={{
                            color: "#fff",
                            fontSize: 12,
                            paddingVertical: 4,
                        }}
                        buttonStyle={{
                            justifyContent: "center",
                            borderRadius: 20,
                            marginHorizontal: 20,
                            paddingHorizontal: 10,
                            backgroundColor: fanLevel === 0 ? APP_COLOR.ORANGE : APP_COLOR.GREEN,
                        }}
                        pressStyle={{ alignSelf: "stretch" }}
                    />
                </View>

                <View style={styles.themometerCard}>
                    <Thermometer temperature={tempRes as number} />
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.switchRow}>
                    <Text style={styles.label}>Chế độ tự động</Text>
                    <Switch
                        trackColor={{ false: "#B0BEC5", true: "#81C784" }}
                        thumbColor={isAutomatic ? "#FFFFFF" : "#ECEFF1"}
                        onValueChange={toggleAutomatic}
                        value={isAutomatic}
                    />
                </View>
            </View>

            {isAutomatic && (
                <>
                    <View style={styles.card}>
                        <View style={styles.switchRow}>
                            <Text style={styles.label}>Chỉnh sửa cấu hình</Text>
                            <Switch
                                trackColor={{ false: "#B0BEC5", true: "#81C784" }}
                                thumbColor={isEditing ? "#FFFFFF" : "#ECEFF1"}
                                onValueChange={toggleEditMode}
                                value={isEditing}
                            />
                        </View>
                    </View>

                    {fanOns.length > 0 ? (
                        fanOns.map((item, index) => (
                            <View key={item._id || index} style={styles.card}>
                                <Text style={styles.cardTitle}>Mức cảnh báo #{index + 1}</Text>

                                {/* Threshold */}
                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <FontAwesome5
                                            name="thermometer-half"
                                            size={20}
                                            color={APP_COLOR.GREEN}
                                            style={{ width: 30 }}
                                        />
                                    </Text>
                                    <Text style={styles.infoLabel}>Threshold</Text>
                                    {isEditing ? (
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={item.threshold.toString()}
                                            onChangeText={(text) =>
                                                updateFanOn(index, "threshold", text)
                                            }
                                            placeholder="Threshold (°C)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    ) : (
                                        <Text style={styles.infoValueOrange}>
                                            {item.threshold} °C
                                        </Text>
                                    )}
                                </View>

                                {/* Intensity */}
                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <Feather
                                            name="wind"
                                            size={20}
                                            color={APP_COLOR.GREEN}
                                            style={{ width: 30 }}
                                        />
                                    </Text>
                                    <Text style={styles.infoLabel}>Intensity</Text>
                                    {isEditing ? (
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={item.intensity.toString()}
                                            onChangeText={(text) =>
                                                updateFanOn(index, "intensity", text)
                                            }
                                            placeholder="Intensity (%)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    ) : (
                                        <Text style={styles.infoValueGreen}>
                                            {item.intensity} %
                                        </Text>
                                    )}
                                </View>


                                {isEditing && (
                                    <TouchableOpacity
                                        onPress={() => removeFanOn(index)}
                                        style={styles.removeBtn}
                                    >
                                        <Text style={styles.removeText}>
                                            <MaterialIcons name="delete" size={20} color="red" />
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>
                            Chưa có dữ liệu mức độ cảnh báo.
                        </Text>
                    )}

                    {isEditing && (
                        <>
                            <TouchableOpacity onPress={addFanOn} style={styles.addButton}>
                                <Text style={styles.addButtonText}>Thêm mức độ cảnh báo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleUpdateConfigFan} style={styles.updateButton}>
                                <Text style={styles.updateButtonText}>Lưu cập nhật</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </>
            )}
        </View>
    );

    return (
        <FlatList
            style={styles.container}
            data={[{ key: "content" }]}
            renderItem={() => renderContent()}
            keyExtractor={(item) => item.key}
            ListFooterComponent={<View style={{ height: 20 }} />}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 16,
    },
    fanCard: {
        flex: 4,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
    },
    themometerCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 16,
        marginVertical: 16,
    },
    percentageText: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        marginTop: 8,
    },
    sliderLabel: {
        textAlign: "center",
        marginTop: 8,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
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
        fontSize: 20,
        marginRight: 8,
        width: 30,
        textAlign: "center",
    },
    infoLabel: {
        flex: 1,
        fontSize: 14,
        color: "#555",
    },
    infoValueOrange: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#F4511E",
    },
    infoValueGreen: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#388E3C",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#B0BEC5",
        borderRadius: 8,
        padding: 8,
        fontSize: 14,
        color: "#333",
    },
    removeBtn: {
        backgroundColor: "#FFCDD2",
        paddingVertical: 8,
        paddingHorizontal: 150,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 4,
    },
    removeText: {
        color: "#D32F2F",
        fontSize: 14,
        fontWeight: "600",
    },
    addButton: {
        backgroundColor: APP_COLOR.GREEN,
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
    updateButton: {
        backgroundColor: "#F4511E",
        borderRadius: 20,
        padding: 12,
        alignItems: "center",
        marginBottom: 30,
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    noDataText: {
        fontSize: 16,
        fontStyle: "italic",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 12,
    },
});

export default FanConfigScreen;