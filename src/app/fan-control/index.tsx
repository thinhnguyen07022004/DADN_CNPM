import React, { useEffect, useState } from "react";
import { View, Text, Switch, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Slider from "@react-native-community/slider";
import ShareButton from "@/components/button/share.button";
import Thermometer from "@/components/fancontrol/themometer.control";
import { useCurrentApp } from "@/context/app.context";
import { feetControllerAPI, fetchSingleTemperatureFeedAPI, getFanAPI, updateFanAPI } from "@/utils/api";
import Toast from "react-native-root-toast";

interface IFan {
    _id: string;
    deviceId: string;
    configId: string;
    controlledMode: string;
    fanOns: IFanOn[];
    createdAt: string;
    updatedAt: string;
}

interface IFanOn {
    intensity: number;
    threshold: number;
    _id?: string;
}

interface IFanOnAPI {
    intensity: string;
    threshold: string;
}

const FanConfigScreen = () => {
    const { config } = useCurrentApp();
    const [fanLevel, setFanLevel] = useState(0);
    const [tempRes, setTemRes] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAutomatic, setIsAutomatic] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [fanOns, setFanOns] = useState<IFanOn[]>([]);
    const [fanConfig, setFanConfig] = useState<IFan | null>(null);
    const [previousTemp, setPreviousTemp] = useState<number | null>(null);

    const showToast = (message: string, isError = false) => {
        Toast.show(message, {
            duration: Toast.durations.LONG,
            textColor: "#fff",
            backgroundColor: isError ? "red" : APP_COLOR.GREEN,
            opacity: 1,
        });
    };

    const fetchTemperature = async () => {
        if (!config?.iotName || !config?.iotApiKey) return;
        try {
            const [tempRes] = await Promise.all([
                fetchSingleTemperatureFeedAPI(config.iotName, config.iotApiKey, 1),
            ]);
            const temp = parseFloat(tempRes[0].value);
            if (!isNaN(temp)) setTemRes(temp);
        } catch {
            setError("Failed to fetch temperature data");
        }
    };

    const fetchFanData = async () => {
        if (!config?.id) return;
        try {
            const resFanList = await getFanAPI(config.id);
            const validFanConfig = Array.isArray(resFanList.data)
                ? resFanList.data
                    .filter((fan: IFan) => fan.fanOns && fan.fanOns.length > 0)
                    .sort((a: IFan, b: IFan) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
                : null;

            if (validFanConfig) {
                setFanConfig(validFanConfig);
                setFanOns(validFanConfig.fanOns || []);
            } else {
                setFanConfig(null);
                setFanOns([]);
            }
        } catch {
            setError("Failed to fetch fan configuration");
        }
    };

    const checkTemperatureAndControlFan = async () => {
        if (!config?.iotApiKey || !config?.iotName || !isAutomatic) {
            return;
        }
        try {
            setLoading(true);
            const [tempRes] = await Promise.all([
                fetchSingleTemperatureFeedAPI(config.iotName, config.iotApiKey, 1),
            ]);
            const currentTemp = parseFloat(tempRes[0].value);

            if (isNaN(currentTemp)) {
                throw new Error("Invalid temperature data");
            }

            setTemRes(currentTemp);

            let newFanLevel = 0;
            let conditionMet = false;

            for (const fanOn of fanOns) {
                const tempCondition = currentTemp >= fanOn.threshold;
                if (tempCondition) {
                    newFanLevel = Math.max(newFanLevel, fanOn.intensity);
                    conditionMet = true;
                }
            }

            let shouldTurnOff = true;
            for (const fanOn of fanOns) {
                if (currentTemp >= fanOn.threshold) {
                    shouldTurnOff = false;
                    break;
                }
            }
            if (newFanLevel !== fanLevel || shouldTurnOff) {
                const value = `2:${newFanLevel}`;
                try {
                    await feetControllerAPI(value, config.iotName, config.iotApiKey);
                    setFanLevel(newFanLevel);
                    setPreviousTemp(currentTemp);
                    // Toast.show(
                    //     newFanLevel === 0
                    //         ? `Fan turned off successfully.`
                    //         : `Update fan with intensity ${newFanLevel}%`,
                    //     {
                    //         duration: Toast.durations.LONG,
                    //         textColor: "#fff",
                    //         backgroundColor: APP_COLOR.GREEN,
                    //         opacity: 1,
                    //     }
                    // );
                } catch (apiError: any) {
                    Toast.show(`Error when calling fan API: ${apiError.message}`, {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: "red",
                        opacity: 1,
                    });
                }
            } else {
                setPreviousTemp(currentTemp);
            }
        } catch (err: any) {
            Toast.show(`Error when calling fan API: ${err.message}`, {
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
        if (!config?.iotName || !config?.iotApiKey || !config?.id) return;

        fetchTemperature();
        fetchFanData();

        const interval = setInterval(() => {
            if (isAutomatic && fanOns.length > 0) {
                checkTemperatureAndControlFan();
            } else {
                fetchTemperature();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [config?.iotName, config?.iotApiKey, config?.id, isAutomatic, fanOns.length]);

    const toggleAutomatic = async () => {
        const newValue = !isAutomatic;
        setIsAutomatic(newValue);
        if (newValue && config?.id) {
            await checkTemperatureAndControlFan();
        }
        if (config?.id) {
            const controlledMode = newValue ? "Automatic" : "Manual";
            const fanOnsData: IFanOnAPI[] = fanOns.map(({ intensity, threshold }) => ({
                intensity: intensity.toString(),
                threshold: threshold.toString(),
            }));
            try {
                await updateFanAPI(config.id, controlledMode, fanOnsData);
                showToast(`Switched to ${controlledMode.toLowerCase()} mode`);
            } catch (err: any) {
                showToast(`Error updating mode: ${err.message}`, true);
            }
        }
    };

    const updateFanOn = (index: number, key: "intensity" | "threshold", value: string) => {
        setFanOns((prev) => {
            const updated = [...prev];
            updated[index][key] = parseInt(value) || 0;
            return updated;
        });
    };

    const addFanOn = () => {
        setFanOns((prev) => [...prev, { intensity: 0, threshold: 0 }]);
    };

    const removeFanOn = (index: number) => {
        setFanOns((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateConfigFan = async () => {
        if (!config?.id) {
            showToast("Account not configured", true);
            return;
        }
        const controlledMode = isAutomatic ? "Automatic" : "Manual";
        const fanOnsData: IFanOnAPI[] = fanOns.map(({ intensity, threshold }) => ({
            intensity: intensity.toString(),
            threshold: threshold.toString(),
        }));

        try {
            setLoading(true);
            await updateFanAPI(config.id, controlledMode, fanOnsData);
            setIsEditing(false);
            showToast("Fan configuration updated successfully");
            await checkTemperatureAndControlFan();
        } catch (err: any) {
            showToast(`Error updating fan configuration: ${err.message}`, true);
        } finally {
            setLoading(false);
        }
    };

    const handleControllerFan = async () => {
        if (!config?.iotApiKey || !config?.iotName) {
            showToast("Account not configured", true);
            return;
        }
        const value = `2:${fanLevel}`;
        try {
            setLoading(true);
            await feetControllerAPI(value, config.iotName, config.iotApiKey);
            showToast(`Fan turned on at ${fanLevel}% intensity`);
        } catch (err: any) {
            showToast(`Error turning on fan: ${err.message}`, true);
        } finally {
            setIsAutomatic(false);
            setLoading(false);
        }
    };

    const renderContent = () => (
        <View>
            <View style={styles.rowContainer}>
                <View style={styles.fanCard}>
                    <Text style={styles.title}>Fan Intensity</Text>
                    <AnimatedCircularProgress
                        size={120}
                        width={10}
                        fill={fanLevel}
                        tintColor={APP_COLOR.GREEN}
                        backgroundColor="#eee"
                        rotation={0}
                        lineCap="round"
                    >
                        {() => <Text style={styles.percentageText}>{fanLevel}%</Text>}
                    </AnimatedCircularProgress>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={fanLevel}
                        minimumTrackTintColor={APP_COLOR.GREEN}
                        maximumTrackTintColor="#B0BEC5"
                        onValueChange={setFanLevel}
                    />
                    <ShareButton
                        title={fanLevel === 0 ? "Turn Off Fan" : "Turn On Fan"}
                        icon={<FontAwesome5 name="fan" size={18} color="#fff" />}
                        onPress={handleControllerFan}
                        textStyle={{ color: "#fff", fontSize: 12, paddingVertical: 4 }}
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
                    <Thermometer temperature={tempRes} />
                </View>
            </View>
            <View style={styles.card}>
                <View style={styles.switchRow}>
                    <Text style={styles.label}>Automatic Mode</Text>
                    <Switch
                        trackColor={{ false: "#B0BEC5", true: "#81C784" }}
                        thumbColor={isAutomatic ? "#FFFFFF" : "#ECEFF1"}
                        ios_backgroundColor="#B0BEC5"
                        onValueChange={toggleAutomatic}
                        value={isAutomatic}
                    />
                </View>
            </View>
            {isAutomatic && (
                <>
                    <View style={styles.card}>
                        <View style={styles.switchRow}>
                            <Text style={styles.label}>Update Configuration</Text>
                            <Switch
                                trackColor={{ false: "#B0BEC5", true: "#81C784" }}
                                thumbColor={isEditing ? "#FFFFFF" : "#ECEFF1"}
                                ios_backgroundColor="#B0BEC5"
                                onValueChange={() => setIsEditing((prev) => !prev)}
                                value={isEditing}
                            />
                        </View>
                    </View>
                    {fanOns.length > 0 ? (
                        fanOns.map((item, index) => (
                            <View key={item._id || `fanOn-${index}`} style={styles.card}>
                                <Text style={styles.cardTitle}>Warning Level #{index + 1}</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <FontAwesome5 name="thermometer-half" size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} />
                                    </Text>
                                    <Text style={styles.infoLabel}>Threshold</Text>
                                    {isEditing ? (
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={item.threshold.toString()}
                                            onChangeText={(text) => updateFanOn(index, "threshold", text)}
                                            placeholder="Threshold (°C)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    ) : (
                                        <Text style={styles.infoValueOrange}>{item.threshold} °C</Text>
                                    )}
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <Feather name="wind" size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} />
                                    </Text>
                                    <Text style={styles.infoLabel}>Intensity</Text>
                                    {isEditing ? (
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={item.intensity.toString()}
                                            onChangeText={(text) => updateFanOn(index, "intensity", text)}
                                            placeholder="Intensity (%)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    ) : (
                                        <Text style={styles.infoValueGreen}>{item.intensity} %</Text>
                                    )}
                                </View>
                                {isEditing && (
                                    <TouchableOpacity onPress={() => removeFanOn(index)} style={styles.removeBtn}>
                                        <Text style={styles.removeText}>
                                            <MaterialIcons name="delete" size={20} color="red" />
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No warning level data available</Text>
                    )}
                    {isEditing && (
                        <>
                            <TouchableOpacity onPress={addFanOn} style={styles.addButton}>
                                <Text style={styles.addButtonText}>Add Warning Level</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdateConfigFan} style={styles.updateButton}>
                                <Text style={styles.updateButtonText}>Save Update</Text>
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

export default FanConfigScreen;