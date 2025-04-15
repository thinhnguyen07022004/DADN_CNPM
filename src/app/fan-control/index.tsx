import React, { useState } from "react";
import {
    View,
    Text,
    Switch,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { APP_COLOR } from "@/utils/constant";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const FanConfigScreen = () => {
    const [isAutomatic, setIsAutomatic] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [fanOns, setFanOns] = useState([
        { intensity: 75, threshold: 32 },
        { intensity: 100, threshold: 35 },
    ]);

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
        setFanOns((prev) => [...prev, { intensity: 0, threshold: 0 }]);
    };

    const removeFanOn = (index: number) => {
        setFanOns((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdate = () => {
        setIsEditing(false);
        Alert.alert("Cập nhật thành công!", JSON.stringify(fanOns, null, 2));
        // Gọi API ở đây nếu cần
    };

    // Hàm render nội dung chính
    const renderContent = () => (
        <View>
            <Text style={styles.title}>Fan Controls</Text>

            {/* Chế độ tự động */}
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
                    {/* Chỉnh sửa cấu hình */}
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

                    {!isEditing ? (
                        fanOns.length > 0 ? (
                            fanOns.map((item, index) => (
                                <View key={index} style={styles.card}>
                                    <Text style={styles.cardTitle}>Mức cảnh báo #{index + 1}</Text>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.icon}>
                                            <FontAwesome5 name="thermometer-half" size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} />
                                        </Text>
                                        <Text style={styles.infoLabel}>Threshold</Text>
                                        <Text style={styles.infoValueOrange}>{item.threshold} °C</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.icon}>
                                            <Feather name="wind" size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} />
                                        </Text>
                                        <Text style={styles.infoLabel}>Intensity</Text>
                                        <Text style={styles.infoValueGreen}>{item.intensity} %</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noDataText}>Chưa có dữ liệu mức độ cảnh báo.</Text>
                        )
                    ) : (
                        <>
                            {fanOns.map((item, index) => (
                                <View key={index} style={styles.card}>
                                    <Text style={styles.cardTitle}>Mức cảnh báo #{index + 1}</Text>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.icon}>
                                            <FontAwesome5 name="thermometer-half" size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} />
                                        </Text>
                                        <Text style={styles.infoLabel}>Threshold</Text>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={item.threshold.toString()}
                                            onChangeText={(text) => updateFanOn(index, "threshold", text)}
                                            placeholder="Threshold (°C)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.icon}><Feather name="wind" size={20} color={APP_COLOR.GREEN} style={{ width: 30 }} /></Text>
                                        <Text style={styles.infoLabel}>Intensity</Text>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            value={item.intensity.toString()}
                                            onChangeText={(text) => updateFanOn(index, "intensity", text)}
                                            placeholder="Intensity (%)"
                                            placeholderTextColor="#B0BEC5"
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => removeFanOn(index)} style={styles.removeBtn}>
                                        <Text style={styles.removeText}>
                                            <MaterialIcons name="delete" size={20} color="red" style={{ width: 30 }} />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TouchableOpacity onPress={addFanOn} style={styles.addButton}>
                                <Text style={styles.addButtonText}>Thêm mức độ cảnh báo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
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
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginLeft: 16,
        marginVertical: 16,
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
        paddingHorizontal: 16,
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