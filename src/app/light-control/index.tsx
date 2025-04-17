import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Switch,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ColorPicker from "react-native-wheel-color-picker";
import { APP_COLOR } from "@/utils/constant";
import ShareButton from "@/components/button/share.button";
import { useCurrentApp } from "@/context/app.context";
import {
    feetControllerAPI,
    fetchSingleTemperatureFeedAPI,
    getLightAPI,
    updateLightAPI,
} from "@/utils/api";
import Toast from "react-native-root-toast";
import LightSensor from "@/components/lightcontrol/light.sensor";

interface ILightOn {
    color: string;
    threshold: number;
    _id: string;
}

interface ILight {
    controlledMode: string;
    lightsOns: ILightOn[];
    updatedAt: string;
    onTime?: string;
    offTime?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const LightConfigScreen = () => {
    const { config } = useCurrentApp();
    const [lightColor, setLightColor] = useState("#000000");
    const [previousColor, setPreviousColor] = useState("#000000");
    const [brightness, setBrightness] = useState(50); // Giả lập độ sáng từ 0-100
    const [tempRes, setTemRes] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAutomatic, setIsAutomatic] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [lightsOns, setLightsOns] = useState<ILightOn[]>([]);
    const [lightConfig, setLightConfig] = useState<ILight | null>(null);
    const [previousTemp, setPreviousTemp] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setBrightness(Math.floor(Math.random() * 101));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const checkTemperatureAndControlLight = async () => {
        if (!config?.iotApiKey || !config?.iotName || !isAutomatic) {
            return;
        }

        try {
            setLoading(true);
            const [tempRes] = await Promise.all([
                fetchSingleTemperatureFeedAPI(config.iotName, config.iotApiKey, 1),
            ]);
            const currentTemp = parseFloat(tempRes[0].value);
            if (previousTemp !== null && Math.abs(currentTemp - previousTemp) < 0.1) {
                return;
            }

            setPreviousTemp(currentTemp);
            setTemRes(currentTemp);

            let newColor = "#000000";
            for (const lightOn of lightsOns) {
                if (currentTemp >= lightOn.threshold) {
                    newColor = lightOn.color;
                }
            }

            if (newColor !== lightColor) {
                const value = `3:${newColor}`;
                await feetControllerAPI(value, config.iotName, config.iotApiKey);
                setLightColor(newColor);
                setPreviousColor(newColor);
                Toast.show(`Cập nhật đèn với màu ${newColor}`, {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: APP_COLOR.GREEN,
                    opacity: 1,
                });
            } else {
                console.log("Light color unchanged, no API call needed");
            }
        } catch (err: any) {
            console.error("Error in automatic light control:", err);
            Toast.show(`Lỗi khi tự động điều khiển đèn: ${err.message}`, {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!config?.iotName || !config?.iotApiKey || !config?.id) {
            return;
        }

        const fetchData = async () => {
            try {
                const [tempRes] = await Promise.all([
                    fetchSingleTemperatureFeedAPI(config.iotName, config.iotApiKey, 1),
                ]);
                setTemRes(parseFloat(tempRes[0].value));
            } catch (err) {
                console.error("Fetch feed error:", err);
                setError("Failed to fetch temperature");
            }
        };

        const fetchLightData = async () => {
            try {
                const resLightList = await getLightAPI(config.id);
                const validLightConfig = Array.isArray(resLightList)
                    ? resLightList
                        .filter(
                            (light: ILight) => light.lightsOns && light.lightsOns.length > 0
                        )
                        .sort(
                            (a: ILight, b: ILight) =>
                                new Date(b.updatedAt).getTime() -
                                new Date(a.updatedAt).getTime()
                        )[0]
                    : null;

                if (validLightConfig) {
                    setLightConfig(validLightConfig);
                    setLightsOns(validLightConfig.lightsOns || []);
                } else {
                    setLightConfig(null);
                    setLightsOns([]);
                }
            } catch (err) {
                console.error("Fetch light config error:", err);
                setError("Failed to fetch light configuration");
            }
        };

        fetchData();
        fetchLightData();

        let interval: NodeJS.Timeout | null = null;
        if (isAutomatic && lightsOns.length > 0) {
            checkTemperatureAndControlLight();
            interval = setInterval(checkTemperatureAndControlLight, 10000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [config?.iotName, config?.iotApiKey, config?.id, isAutomatic, lightsOns]);

    const toggleAutomatic = () => {
        setIsAutomatic((prev) => !prev);
        if (!isAutomatic) {
            checkTemperatureAndControlLight();
        }
    };

    const updateLightOn = (
        index: number,
        key: "color" | "threshold",
        value: string
    ) => {
        const updated = [...lightsOns];
        if (key === "color") {
            updated[index].color = value;
        } else if (key === "threshold") {
            updated[index].threshold = parseInt(value) || 0;
        }
        setLightsOns(updated);
    };

    const addLightOn = () => {
        setLightsOns((prev) => [
            ...prev,
            { color: "#ffffff", threshold: 0, _id: "" },
        ]);
    };

    const removeLightOn = (index: number) => {
        setLightsOns((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateConfigLight = async () => {
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
        const onTime = lightConfig?.onTime || "18:30";
        const offTime = lightConfig?.offTime || "6:00";
        const lightsOnsData = lightsOns.map(({ color, threshold }) => ({
            color,
            threshold: threshold.toString(),
        }));

        try {
            setLoading(true);
            await updateLightAPI(
                config.id,
                controlledMode,
                onTime,
                offTime,
                lightsOnsData
            );
            setIsEditing(false);
            Toast.show("Cập nhật cấu hình đèn thành công!", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: APP_COLOR.GREEN,
                opacity: 1,
            });
            checkTemperatureAndControlLight();
        } catch (err) {
            console.error("Update light config error:", err);
            Toast.show("Không thể cập nhật cấu hình đèn.", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleControllerLight = async () => {
        if (!config?.iotApiKey || !config?.iotName) {
            Toast.show("Người dùng chưa cấu hình tài khoản", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }
        if (!/^#[0-9A-Fa-f]{6}$/.test(lightColor)) {
            Toast.show("Mã màu không hợp lệ", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }
        const value = `3:${lightColor}`;
        try {
            setLoading(true);
            await feetControllerAPI(value, config.iotName, config.iotApiKey);
            Toast.show(`Bật đèn thành công với màu ${lightColor}.`, {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: APP_COLOR.GREEN,
                opacity: 1,
            });
        } catch (err: any) {
            console.error("Light control error:", err);
            Toast.show(`Lỗi khi bật đèn: ${err.message}`, {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
        } finally {
            setIsAutomatic(false);
            setLoading(false);
        }
    };

    const commitColor = () => {
        setPreviousColor(lightColor);
        Toast.show("Màu đã được áp dụng!", {
            duration: Toast.durations.LONG,
            textColor: "#fff",
            backgroundColor: APP_COLOR.GREEN,
            opacity: 1,
        });
    };

    const revertColor = () => {
        setLightColor(previousColor);
        Toast.show("Màu đã được khôi phục!", {
            duration: Toast.durations.LONG,
            textColor: "#fff",
            backgroundColor: APP_COLOR.ORANGE,
            opacity: 1,
        });
    };

    const renderContent = () => (
        <View>
            <View style={styles.rowContainer}>
                <View style={styles.lightCard}>
                    <Text style={[styles.title, { color: lightColor }]}>RGB: {lightColor}</Text>
                    <ColorPicker
                        color={lightColor}
                        onColorChangeComplete={(color: string) => {
                            setLightColor(color);
                        }}
                        thumbSize={20}
                        sliderSize={20}
                        noSnap={true}
                        row={true}
                        swatches={true}
                        swatchesLast={true}
                    />
                    <View style={styles.controlsContainer}>
                        <ShareButton
                            title={"Commit"}
                            onPress={commitColor}
                            textStyle={{
                                color: "#fff",
                                fontSize: 12,
                                paddingVertical: 4,
                            }}
                            buttonStyle={{
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 5,
                                alignItems: "center",
                                backgroundColor: APP_COLOR.GREEN,
                            }}
                        />

                        <ShareButton
                            title={"Revert"}
                            onPress={revertColor}
                            textStyle={{
                                color: "#fff",
                                fontSize: 12,
                                paddingVertical: 4,
                            }}
                            buttonStyle={{
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 5,
                                alignItems: "center",
                                backgroundColor: "red",
                            }}
                        />
                    </View>
                </View>
                <View style={styles.themometerCard}>
                    <LightSensor temperature={tempRes} />
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
                                onValueChange={() => setIsEditing((prev) => !prev)}
                                value={isEditing}
                            />
                        </View>
                    </View>

                    {lightsOns.length > 0 ? (
                        lightsOns.map((item, index) => (
                            <View key={item._id || index} style={styles.card}>
                                <Text style={styles.cardTitle}>Mức cảnh báo #{index + 1}</Text>
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
                                                updateLightOn(index, "threshold", text)
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
                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <Feather
                                            name="sun"
                                            size={20}
                                            color={APP_COLOR.GREEN}
                                            style={{ width: 30 }}
                                        />
                                    </Text>
                                    <Text style={styles.infoLabel}>Color</Text>
                                    {isEditing ? (
                                        <ColorPicker
                                            color={item.color}
                                            onColorChangeComplete={(color: string) => {
                                                console.log("Selected color small:", color);
                                                updateLightOn(index, "color", color);
                                            }}
                                            thumbSize={20}
                                            sliderSize={20}
                                            noSnap={true}
                                            row={false}
                                            swatches={true}
                                            swatchesLast={true}
                                        />
                                    ) : (
                                        <View
                                            style={[
                                                styles.colorPreviewSmall,
                                                { backgroundColor: item.color },
                                            ]}
                                        />
                                    )}
                                </View>
                                {isEditing && (
                                    <TouchableOpacity
                                        onPress={() => removeLightOn(index)}
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
                            <TouchableOpacity onPress={addLightOn} style={styles.addButton}>
                                <Text style={styles.addButtonText}>Thêm mức độ cảnh báo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleUpdateConfigLight} style={styles.updateButton}>
                                <Text style={styles.updateButtonText}>Lưu cập nhật</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </>
            )
            }
        </View >
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

    lightCard: {
        flex: 6,
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
        marginVertical: 16,
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
    controlsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginVertical: 10,
    },
    controlButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        alignItems: "center",
    },

    colorPreviewSmall: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#B0BEC5",
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
        width: "100%",
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
        width: "100%",
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
        color: "#555",
        textAlign: "center",
        marginBottom: 12,
    },
});

export default LightConfigScreen;