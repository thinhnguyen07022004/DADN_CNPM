import React, { useEffect, useRef, useState } from "react";
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
import {
    feetControllerAPI, fetchSingleTemperatureFeedAPI, fetchSingleHumidityFeedAPI, getMistingAPI, updateMistingAPI,
} from "@/utils/api";
import Toast from "react-native-root-toast";
import MistingSensor from "@/components/mistingcontrol/misting.sensor";

interface IMistingOn {
    intensity: number;
    tempThreshold: number;
    moistureThreshold: number;
    _id: string;
}

interface IMisting {
    controlledMode: string;
    mistingOns: IMistingOn[];
    updatedAt: string;
}

const MistingControlScreen = () => {
    const { config } = useCurrentApp();
    const [mistingLevel, setMistingLevel] = useState(0);
    const [tempRes, setTemRes] = useState<number>(0);
    const [moistureRes, setMoistureRes] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isAutomatic, setIsAutomatic] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [mistingOns, setMistingOns] = useState<IMistingOn[]>([]);
    const [mistingConfig, setMistingConfig] = useState<IMisting | null>(null);
    const previousTemp = useRef<number | null>(null);
    const previousMoisture = useRef<number | null>(null)


    const checkTemperatureAndControlMisting = async () => {
        if (!config?.iotApiKey || !config?.iotName || !isAutomatic) {
            return;
        }

        try {
            setLoading(true);
            const [tempRes, moistureRes] = await Promise.all([
                fetchSingleTemperatureFeedAPI(config.iotName, config.iotApiKey, 1),
                fetchSingleHumidityFeedAPI(config.iotName, config.iotApiKey, 1),
            ]);
            const currentTemp = parseFloat(tempRes[0].value);
            const currentMoisture = (parseFloat(moistureRes[0].value));

            if (isNaN(currentTemp) || isNaN(currentMoisture)) {
                throw new Error("Invalid sensor data");
            }

            setTemRes(currentTemp);
            setMoistureRes(currentMoisture);

            let newMistingLevel = 0;
            let conditionMet = false;

            for (const mistingOn of mistingOns) {
                const tempCondition = currentTemp > mistingOn.tempThreshold;
                const moistureCondition = currentMoisture < mistingOn.moistureThreshold;
                if (tempCondition || moistureCondition) {
                    newMistingLevel = Math.max(newMistingLevel, mistingOn.intensity);
                    conditionMet = true;
                }
            }

            let shouldTurnOff = true;
            for (const mistingOn of mistingOns) {
                const tempCondition = currentTemp >= mistingOn.tempThreshold;
                const moistureCondition = currentMoisture <= mistingOn.moistureThreshold;
                if (tempCondition || moistureCondition) {
                    shouldTurnOff = false;
                    break;
                }
            }

            if (newMistingLevel !== mistingLevel || shouldTurnOff) {
                const value = `3:${newMistingLevel}`;
                try {
                    await feetControllerAPI(value, config.iotName, config.iotApiKey);
                    setMistingLevel(newMistingLevel);
                    previousTemp.current = currentTemp;
                    previousMoisture.current = currentMoisture;
                    Toast.show(
                        newMistingLevel === 0
                            ? `Turn off misting successfully!`
                            : `Update misting with intensity ${newMistingLevel}%`,
                        {
                            duration: Toast.durations.LONG,
                            textColor: "#fff",
                            backgroundColor: APP_COLOR.GREEN,
                            opacity: 1,
                        }
                    );
                } catch (apiError: any) {
                    Toast.show(`Error when calling the misting API: ${apiError.message}`, {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: "red",
                        opacity: 1,
                    });
                }
            } else {
                previousTemp.current = currentTemp;
                previousMoisture.current = currentMoisture;
            }
        } catch (err: any) {
            Toast.show(`Error when automatically controlling misting: ${err.message}`, {
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
                const [tempRes, moistureRes] = await Promise.all([
                    fetchSingleTemperatureFeedAPI(config.iotName, config.iotApiKey, 1),
                    fetchSingleHumidityFeedAPI(config.iotName, config.iotApiKey, 1),
                ]);
                setTemRes(parseFloat(tempRes[0].value));
                setMoistureRes((parseFloat(moistureRes[0].value)));
            } catch (err) {
                setError("Failed to fetch temperature or moisture");
            }
        };

        const fetchMistingData = async () => {
            try {
                const resMistingList = await getMistingAPI(config.id);
                const validMistingConfig = Array.isArray(resMistingList.data)
                    ? resMistingList.data
                        .filter((misting: IMisting) => misting.mistingOns && misting.mistingOns.length > 0)
                        .sort(
                            (a: IMisting, b: IMisting) =>
                                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                        )[0]
                    : null;

                if (validMistingConfig) {
                    setMistingConfig(validMistingConfig);
                    setMistingOns(validMistingConfig.mistingOns || []);
                } else {
                    setMistingConfig(null);
                    setMistingOns([]);
                }
            } catch (err) {
                setError("Failed to fetch misting configuration");
            }
        };

        fetchData();
        fetchMistingData();

        let interval: NodeJS.Timeout | null = null;
        if (isAutomatic && mistingOns.length > 0) {
            checkTemperatureAndControlMisting();
            interval = setInterval(checkTemperatureAndControlMisting, 10000);
        } else {
            fetchData();
            interval = setInterval(fetchData, 10000);
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
            checkTemperatureAndControlMisting();
        }
    };

    const updateMistingOn = (index: number, key: "intensity" | "tempThreshold" | "moistureThreshold", value: string) => {
        const updated = [...mistingOns];
        updated[index][key] = parseInt(value) || 0;
        setMistingOns(updated);
    };

    const addMistingOn = () => {
        setMistingOns((prev) => [...prev, { intensity: 0, tempThreshold: 0, moistureThreshold: 0, _id: "" }]);
    };

    const removeMistingOn = (index: number) => {
        setMistingOns((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateConfigMisting = async () => {
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
        const mistingOnsData = mistingOns.map(({ intensity, tempThreshold, moistureThreshold }) => ({
            intensity: intensity ? intensity.toString() : "0",
            tempThreshold: tempThreshold ? tempThreshold.toString() : "0",
            moistureThreshold: moistureThreshold ? moistureThreshold.toString() : "0",
        }));

        try {
            setLoading(true);
            const res = await updateMistingAPI(config.id, controlledMode, mistingOnsData);
            setIsEditing(false);
            Toast.show("Mist configuration updated successfully!", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: APP_COLOR.GREEN,
                opacity: 1,
            });
            checkTemperatureAndControlMisting();
        } catch (err) {
            Toast.show("Unable to update mist configuration!", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleControllerMisting = async () => {
        if (!config?.iotApiKey || !config?.iotName) {
            Toast.show("User has not configured account", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            return;
        }
        const value = `3:${mistingLevel}`;
        try {
            setLoading(true);
            await feetControllerAPI(value, config.iotName, config.iotApiKey);
            {
                mistingLevel === 0 ?
                    Toast.show(`Misting turned off successfully!`, {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: APP_COLOR.GREEN,
                        opacity: 1,
                    })
                    :
                    Toast.show(`Misting successfully turned on with intensity ${mistingLevel}%.`, {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: APP_COLOR.GREEN,
                        opacity: 1,
                    })
            }
        } catch (err: any) {
            Toast.show(`Error when turning on mist: ${err.message}`, {
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

    const renderContent = () => (
        <View>
            <View style={styles.rowContainer}>
                <View style={styles.mistingCard}>
                    <Text style={styles.title}>Misting intensity</Text>
                    <AnimatedCircularProgress
                        size={120}
                        width={10}
                        fill={mistingLevel}
                        tintColor={APP_COLOR.GREEN}
                        backgroundColor="#eee"
                        rotation={0}
                        lineCap="round"
                    >
                        {() => <Text style={styles.percentageText}>{mistingLevel}%</Text>}
                    </AnimatedCircularProgress>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={mistingLevel}
                        minimumTrackTintColor={APP_COLOR.GREEN}
                        maximumTrackTintColor="#B0BEC5"
                        onValueChange={(val) => setMistingLevel(val)}
                    />
                    <ShareButton
                        title={mistingLevel === 0 ? "Turn off misting" : "Turn on misting"}
                        icon={<FontAwesome5 name="spray-can" size={18} color="#fff" />}
                        onPress={handleControllerMisting}
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
                            backgroundColor: mistingLevel === 0 ? APP_COLOR.ORANGE : APP_COLOR.GREEN,
                        }}
                        pressStyle={{ alignSelf: "stretch" }}
                    />
                </View>

                <View style={styles.themometerCard}>
                    <Thermometer temperature={tempRes} />
                </View>

                <View style={styles.themometerCard}>
                    <MistingSensor mistingSensor={moistureRes} />
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
                            <Text style={styles.label}>Update Configuration</Text>
                            <Switch
                                trackColor={{ false: "#B0BEC5", true: "#81C784" }}
                                thumbColor={isEditing ? "#FFFFFF" : "#ECEFF1"}
                                onValueChange={() => setIsEditing((prev) => !prev)}
                                value={isEditing}
                            />
                        </View>
                    </View>

                    {mistingOns.length > 0 ? (
                        mistingOns.map((item, index) => (
                            <View key={item._id || index} style={styles.card}>
                                <Text style={styles.cardTitle}>Warning level #{index + 1}</Text>
                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <FontAwesome5
                                            name="thermometer-half"
                                            size={20}
                                            color={APP_COLOR.GREEN}
                                            style={{ width: 30 }}
                                        />
                                    </Text>
                                    <Text style={styles.infoLabel}>Threshold Temperature</Text>
                                    {isEditing ? (
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={item.tempThreshold ? item.tempThreshold.toString() : "0"}
                                            onChangeText={(text) => updateMistingOn(index, "tempThreshold", text)}
                                            placeholder="Threshold Temperature (°C)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    ) : (
                                        <Text style={styles.infoValueOrange}>{item.tempThreshold} °C</Text>
                                    )}
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <Feather
                                            name="droplet"
                                            size={20}
                                            color={APP_COLOR.GREEN}
                                            style={{ width: 30 }}
                                        />
                                    </Text>
                                    <Text style={styles.infoLabel}>Threshold Humidity</Text>
                                    {isEditing ? (
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={item.moistureThreshold ? item.moistureThreshold.toString() : "0"}
                                            onChangeText={(text) => updateMistingOn(index, "moistureThreshold", text)}
                                            placeholder="Threshold Humidity (RH)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    ) : (
                                        <Text style={styles.infoValueOrange}>{item.moistureThreshold} RH</Text>
                                    )}
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.icon}>
                                        <Feather
                                            name="cloud-drizzle"
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
                                            value={item.intensity ? item.intensity.toString() : "0"}
                                            onChangeText={(text) => updateMistingOn(index, "intensity", text)}
                                            placeholder="Intensity (%)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    ) : (
                                        <Text style={styles.infoValueGreen}>{item.intensity} %</Text>
                                    )}
                                </View>
                                {isEditing && (
                                    <TouchableOpacity onPress={() => removeMistingOn(index)} style={styles.removeBtn}>
                                        <Text style={styles.removeText}>
                                            <MaterialIcons name="delete" size={20} color="red" />
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>No warning level data available.</Text>
                    )}

                    {isEditing && (
                        <>
                            <TouchableOpacity onPress={addMistingOn} style={styles.addButton}>
                                <Text style={styles.addButtonText}>Add Warning Level</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdateConfigMisting} style={styles.updateButton}>
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
    mistingCard: {
        flex: 5,
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

export default MistingControlScreen;