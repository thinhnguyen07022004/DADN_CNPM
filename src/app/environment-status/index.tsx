import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";

const plots = [
    "Plot 01",
    "Plot 02",
    "Plot 03",
    "Plot 04",
    "Plot 05",
    "Plot 06",
    "Plot 07",
    "Plot 08",
];

const sensorData = [
    { sensorId: "humidityfeed", label: "Soil Humidity", value: 79, unit: "%", icon: "tint" },
    { sensorId: "phfeed", label: "pH", value: 6.5, unit: "", icon: "water" },
    { sensorId: "tempfeed", label: "Temperature", value: 28.2, unit: "℃", icon: "thermometer-half" },
    { sensorId: "luxfeed", label: "Lux", value: 920, unit: "lux", icon: "sun" },
];

const screenWidth = Dimensions.get("window").width;

// Tách thành từng nhóm 4 plot
const groupIntoPages = (data: any, size: any) => {
    const result = [];
    for (let i = 0; i < data.length; i += size) {
        result.push(data.slice(i, i + size));
    }
    return result;
};

const EnvironmentScreen = () => {
    const [selectedPlot, setSelectedPlot] = useState("Plot 01");
    const pages = groupIntoPages(plots, 4);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Environment Controls</Text>

            <FlatList
                data={pages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => `page-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.page}>
                        {item.map((plot: any, idx: any) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.plotItem,
                                    selectedPlot === plot && styles.activePlot,
                                ]}
                                onPress={() => setSelectedPlot(plot)}
                            >
                                <MaterialCommunityIcons
                                    name="sprout"
                                    size={26}
                                    color={selectedPlot === plot ? "#fff" : APP_COLOR.GREEN}
                                />
                                <Text
                                    style={[
                                        styles.plotLabel,
                                        selectedPlot === plot && { color: "#fff" },
                                    ]}
                                >
                                    {plot}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />

            {/* Chi tiết plot */}
            <ScrollView style={styles.plotDetail} showsVerticalScrollIndicator={false}>
                <View style={styles.plotHeader}>
                    <Text style={styles.plotTitle}>{selectedPlot}</Text>
                    <FontAwesome5 name="cog" size={20} color="#555" />
                </View>

                {/* Humidity Row */}
                <View style={styles.humidityRow}>
                    <View style={styles.humidityBox}>
                        <Text style={styles.humidityLabel}>Soil Humidity</Text>
                        <Text style={styles.humidityValue}>{sensorData[0].value} {sensorData[0].unit}</Text>
                    </View>
                    <View style={styles.humidityBox}>
                        <Text style={styles.humidityLabel}>Air Humidity</Text>
                        <Text style={styles.humidityValue}>--</Text>
                    </View>
                </View>

                {/* Other sensor info */}
                {sensorData.slice(1).map((item, index) => (
                    <View key={index} style={styles.infoRow}>
                        <FontAwesome5 name={item.icon} size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} />
                        <Text style={styles.infoLabel}>{item.label}</Text>
                        <Text style={styles.infoValue}>{item.value} {item.unit}</Text>
                    </View>
                ))}

                {/* <Text style={styles.timeText}>08/04/2025, 21:32</Text> */}

                <TouchableOpacity style={styles.updateButton}>
                    <Text style={styles.updateButtonText}>Update Now</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default EnvironmentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.GREEN,
        paddingTop: 20,
    },
    title: {
        fontSize: 22,
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 16,
    },
    page: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: screenWidth,
        paddingVertical: 16,
    },
    plotItem: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 50,
        width: 80,
        height: 80,
    },
    activePlot: {
        backgroundColor: APP_COLOR.ORANGE,
    },
    plotLabel: {
        marginTop: 6,
        fontWeight: "600",
        color: APP_COLOR.GREEN,
        fontSize: 13,
        textAlign: "center",
    },
    plotDetail: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 16,
    },
    plotHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    plotTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    humidityRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 16,
    },
    humidityBox: {
        backgroundColor: "#F8F8F8",
        flex: 1,
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 5,
    },
    humidityLabel: {
        fontSize: 12,
        color: "#555",
    },
    humidityValue: {
        color: APP_COLOR.ORANGE,
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 5,
    },
    infoRow: {
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    infoLabel: {
        flex: 1,
        fontSize: 14,
        color: "#555",
    },
    infoValue: {
        color: APP_COLOR.GREEN,
        fontWeight: "bold",
    },
    timeText: {
        fontSize: 12,
        color: "#999",
        marginTop: 10,
    },
    updateButton: {
        backgroundColor: APP_COLOR.ORANGE,
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 16,
        marginBottom: 30,
    },
    updateButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
