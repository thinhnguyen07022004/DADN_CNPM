import React, { useEffect, useState } from "react";
import { View, Text, Switch, FlatList, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ColorPicker from "react-native-wheel-color-picker";
import { APP_COLOR } from "@/utils/constant";
import ShareButton from "@/components/button/share.button";
import { useCurrentApp } from "@/context/app.context";
import { feetControllerAPI, fetchSingleLightFeedAPI, getLightAPI, updateLightAPI, } from "@/utils/api";
import Toast from "react-native-root-toast";
import LightSensor from "@/components/lightcontrol/light.sensor";
import { router } from "expo-router";

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

const LightConfigScreen = () => {
    const { config } = useCurrentApp();
    const [lightColor, setLightColor] = useState("#000000");
    const [previousColor, setPreviousColor] = useState("#000000");
    const [tempRes, setTemRes] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAutomatic, setIsAutomatic] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [lightsOns, setLightsOns] = useState<ILightOn[]>([]);
    const [lightConfig, setLightConfig] = useState<ILight | null>(null);
    const [previousLight, setPreviousLight] = useState<number | null>(null);
    const [onTime, setOnTime] = useState<string>("18:30");
    const [offTime, setOffTime] = useState<string>("6:00");

    const checkLightFeedAndControlLight = async () => {
        if (!config?.iotApiKey || !config?.iotName || !isAutomatic) {
            return;
        }

        try {
            setLoading(true);
            const [tempRes] = await Promise.all([
                fetchSingleLightFeedAPI(config.iotName, config.iotApiKey, 1),
            ]);
            const currentLight = parseInt(tempRes[0].value, 10);

            if (isNaN(currentLight)) {
                throw new Error("Invalid light sensor data");
            }
            setTemRes(currentLight);

            let newColor = "#000000";
            let conditionMet = false;

            for (const lightOn of lightsOns) {
                const lightCondition = currentLight < lightOn.threshold;
                if (lightCondition) {
                    newColor = lightOn.color;
                    conditionMet = true;
                    break;
                }
            }

            let shouldTurnOff = true;
            for (const lightOn of lightsOns) {
                if (currentLight < lightOn.threshold) {
                    shouldTurnOff = false;
                    break;
                }
            }

            if (newColor !== lightColor || shouldTurnOff) {
                const value = `1:${newColor}`;
                try {
                    await feetControllerAPI(value, config.iotName, config.iotApiKey);
                    setLightColor(newColor);
                    setPreviousColor(newColor);
                    setPreviousLight(currentLight);
                    // Toast.show(
                    //     newColor === "#000000"
                    //         ? "Tắt đèn do ánh sáng đủ mạnh"
                    //         : `Bật đèn với màu ${newColor}`,
                    //     {
                    //         duration: Toast.durations.LONG,
                    //         textColor: "#fff",
                    //         backgroundColor: APP_COLOR.GREEN,
                    //         opacity: 1,
                    //     }
                    // );
                } catch (apiError: any) {
                    Toast.show(`Error calling the light API: ${apiError.message}`, {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: "red",
                        opacity: 1,
                    });
                }
            } else {
                setPreviousLight(currentLight);

            }
        } catch (err: any) {
            Toast.show(`Error when automatically controlling lights: ${err.message}`, {
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
            Toast.show("User has not configured account", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            router.navigate("/(tabs)/configuration")
            return;
        }

        const fetchLightSensorData = async () => {
            setLoading(true);
            try {
                const [tempRes] = await Promise.all([
                    fetchSingleLightFeedAPI(config.iotName, config.iotApiKey, 1),
                ]);
                setTemRes(parseInt(tempRes[0].value, 10));
            } catch (err) {
                Toast.show("Failed to fetch light sensor data", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: "red",
                    opacity: 1,
                });
            }
            finally {
                setLoading(false);
            }
        };

        const fetchWarningLightData = async () => {
            try {
                const resLightList = await getLightAPI(config.id);
                const data = Array.isArray(resLightList.data) ? resLightList.data : [];
                const firstConfig = data.length > 0 ? data[0] : null;

                if (firstConfig) {
                    setLightConfig(firstConfig);
                    setLightsOns(firstConfig.lightOns || []);
                    setOnTime(firstConfig.onTime || "18:30");
                    setOffTime(firstConfig.offTime || "6:00");
                } else {
                    setLightConfig(null);
                    setLightsOns([]);
                }
            } catch (err) {
                Toast.show("Failed to fetch light configuration", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: "red",
                    opacity: 1,
                });
            }
        };
        fetchLightSensorData();
        fetchWarningLightData();
        let interval: NodeJS.Timeout | null = null;
        if (isAutomatic && lightsOns.length > 0) {
            checkLightFeedAndControlLight();
            interval = setInterval(checkLightFeedAndControlLight, 10000);
        }
        else {
            fetchLightSensorData();
            interval = setInterval(fetchLightSensorData, 10000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [config?.iotName, config?.iotApiKey, config?.id, isAutomatic]);

    const toggleAutomatic = () => {
        setIsAutomatic((prev) => !prev);
        if (!isAutomatic) {
            checkLightFeedAndControlLight();
        }
    };

    const updateLightOn = (
        index: number,
        key: "color" | "threshold" | "onTime" | "offTime",
        value: string
    ) => {
        const updated = [...lightsOns];
        if (key === "color") {
            updated[index].color = value;
        } else if (key === "threshold") {
            updated[index].threshold = parseInt(value, 10) || 0;
        }
        else if (key === "onTime") {
            setOnTime(value);
        }
        else if (key === "offTime") {
            setOffTime(value);
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
            Toast.show("User has not configured account", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }
        const controlledMode = "Automatic";
        const lightsOnsData = lightsOns.map(({ color, threshold }) => ({
            color,
            threshold: threshold.toString(),
        }));
        try {
            setLoading(true);
            const res = await updateLightAPI(
                config.id,
                controlledMode,
                onTime,
                offTime,
                lightsOnsData
            );
            setIsEditing(false);
            Toast.show("Light configuration updated successfully!", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: APP_COLOR.GREEN,
                opacity: 1,
            });
            checkLightFeedAndControlLight();
        } catch (err) {
            Toast.show("Unable to update light configuration.", {
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
            Toast.show("User has not configured account", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }
        if (!/^#[0-9A-Fa-f]{6}$/.test(lightColor)) {
            Toast.show("Invalid color code", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }
        const value = `1:${lightColor}`;
        try {
            setLoading(true);
            await feetControllerAPI(value, config.iotName, config.iotApiKey);
            {
                lightColor === "#000000" ?
                    Toast.show(`Lights off successfully.`, {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: APP_COLOR.GREEN,
                        opacity: 1,
                    })
                    : Toast.show(`Turn on the light successfully with color ${lightColor}.`, {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: APP_COLOR.GREEN,
                        opacity: 1,
                    })
            }
        } catch (err: any) {
            Toast.show(`Error when turning on the light: ${err.message}`, {
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

    const revertColor = () => {
        setLightColor("#000000");
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
                            onPress={handleControllerLight}
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
                    <LightSensor lightSensor={tempRes} />
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.switchRow}>
                    <Text style={styles.label}>Automatic Mode</Text>
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
                            <Text style={styles.label}>Edit configuration</Text>
                            <Switch
                                trackColor={{ false: "#B0BEC5", true: "#81C784" }}
                                thumbColor={isEditing ? "#FFFFFF" : "#ECEFF1"}
                                onValueChange={() => setIsEditing((prev) => !prev)}
                                value={isEditing}
                            />
                        </View>
                    </View>

                    {isEditing && (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Time Settings</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.icon}>
                                    <FontAwesome5 name="clock" size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} />
                                </Text>
                                <Text style={styles.infoLabel}>On Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={onTime}
                                    onChangeText={setOnTime}
                                    placeholder="On Time (HH:MM)"
                                    placeholderTextColor="#B0BEC5"
                                />
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.icon}>
                                    <FontAwesome5 name="clock" size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} />
                                </Text>
                                <Text style={styles.infoLabel}>Off Time</Text>
                                <TextInput
                                    style={styles.input}
                                    value={offTime}
                                    onChangeText={setOffTime}
                                    placeholder="Off Time (HH:MM)"
                                    placeholderTextColor="#B0BEC5"
                                />
                            </View>
                        </View>
                    )}

                    {lightsOns.length > 0 ? (
                        lightsOns.map((item, index) => (
                            <View key={item._id || index} style={styles.card}>
                                <Text style={styles.cardTitle}>Warning Level #{index + 1}</Text>

                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <FontAwesome5
                                            name="lightbulb"
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
                                            placeholder="Threshold (%)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    ) : (
                                        <Text style={styles.infoValueOrange}>
                                            {item.threshold} %
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <FontAwesome5
                                            name="dot-circle"
                                            size={20}
                                            color={APP_COLOR.GREEN}
                                            style={{ width: 30 }}
                                        />
                                    </Text>
                                    <Text style={styles.infoLabel}>Light Color</Text>
                                    {isEditing ? (
                                        <ColorPicker
                                            color={item.color}
                                            onColorChangeComplete={(color: string) => {
                                                updateLightOn(index, "color", color);
                                            }}
                                            thumbSize={20}
                                            sliderSize={20}
                                            noSnap={true}
                                            row={false}
                                            swatches={false}
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
                            No warning level data available.
                        </Text>
                    )}

                    {isEditing && (
                        <>
                            <TouchableOpacity onPress={addLightOn} style={styles.addButton}>
                                <Text style={styles.addButtonText}>Add Warning Level</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleUpdateConfigLight} style={styles.updateButton}>
                                <Text style={styles.updateButtonText}>Save Update</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </>
            )}
        </View >

    );

    return (
        <>
            <FlatList
                style={styles.container}
                data={[{ key: "content" }]}
                renderItem={() => renderContent()}
                keyExtractor={(item) => item.key}
                ListFooterComponent={<View style={{ height: 20 }} />}
            />
            {/* {loading && <LoadingOverlay />} */}
        </>
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