import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { APP_COLOR } from "@/utils/constant";

const EnvironmentScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Environment</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plotList}>
                {["Plot 01", "Plot 02", "Plot 03", "Plot 04", "Plot 01", "Plot 02", "Plot 03"].map((plot, index) => (
                    <TouchableOpacity key={index} style={[styles.plotItem, index === 0 && styles.activePlot]}>
                        <MaterialCommunityIcons name="sprout" size={30} color={index === 0 ? "#fff" : APP_COLOR.GREEN} />
                        <Text style={[styles.plotLabel, index === 0 && { color: "#fff" }]}>{plot}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.plotDetail} showsVerticalScrollIndicator={false}>
                <View style={styles.plotHeader}>
                    <Text style={styles.plotTitle}>Plot 01</Text>
                    <FontAwesome5 name="cog" size={20} color="#555" />
                </View>

                <View style={styles.humidityRow}>
                    <View style={styles.humidityBox}>
                        <Text style={styles.humidityLabel}>Soil Humidity</Text>
                        <Text style={styles.humidityValue}>32.0</Text>
                    </View>
                    <View style={styles.humidityBox}>
                        <Text style={styles.humidityLabel}>Air Humidity</Text>
                        <Text style={styles.humidityValue}>5.0</Text>
                    </View>
                </View>

                {[
                    { icon: "leaf", label: "EC", value: "11.931" },
                    { icon: "water", label: "pH", value: "10.0" },
                    { icon: "thermometer-half", label: "Temperature", value: "15.0 ℃" },
                    { icon: "sun", label: "Lux", value: "996.0" },
                ].map((item, idx) => (
                    <View key={idx} style={styles.infoRow}>
                        <FontAwesome5 name={item.icon} size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} />
                        <Text style={styles.infoLabel}>{item.label}</Text>
                        <Text style={styles.infoValue}>{item.value}</Text>
                    </View>
                ))}

                <Text style={styles.timeText}>01/11/2019, 10:00:06</Text>

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    logo: {
        width: 100,
        height: 30,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 22,
        color: "#fff",
        fontWeight: 'bold',
        marginLeft: 16,
    },
    plotList: {
        marginVertical: 15,
        paddingHorizontal: 16,
        padding: 50
    },
    plotItem: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginRight: 12,
        alignItems: 'center',
    },
    activePlot: {
        backgroundColor: APP_COLOR.ORANGE,
    },
    plotLabel: {
        marginTop: 6,
        fontWeight: '600',
        color: APP_COLOR.GREEN,
    },
    plotDetail: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 16,
    },
    plotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    plotTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#333",
    },
    humidityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    humidityBox: {
        backgroundColor: '#F8F8F8',
        flex: 1,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    humidityLabel: {
        fontSize: 12,
        color: "#555",
    },
    humidityValue: {
        color: APP_COLOR.ORANGE,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    infoRow: {
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoLabel: {
        flex: 1,
        fontSize: 14,
        color: "#555",
    },
    infoValue: {
        color: APP_COLOR.GREEN,
        fontWeight: 'bold',
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
        alignItems: 'center',
        marginTop: 16,
    },
    updateButtonText: {
        color: "#fff",
        fontWeight: 'bold',
    },
});