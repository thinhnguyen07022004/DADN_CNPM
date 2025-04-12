import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ShareButton from "@/components/button/share.button";
import { APP_COLOR } from "@/utils/constant";

const DoorControlPage = () => {
    const [activeTab, setActiveTab] = useState("ViewInfo");

    // Giả lập dữ liệu door
    const doorData = [
        {
            _id: "67f524709d038e32b7f7f2ee",
            deviceId: "e8bb95b2-a275-4278-aeb5-5b4135b2970a",
            configId: "7d858f06-2898-4a40-b4c9-25e2f701db09",
            doorPassword: "142536",
            createdAt: "2025-04-08T13:28:16.707Z",
            updatedAt: "2025-04-08T13:39:38.831Z",
        },
        {
            _id: "67f524709d038e32b7f7f2ee",
            deviceId: "e8bb95b2-a275-4278-aeb5-5b4135b2970a",
            configId: "7d858f06-2898-4a40-b4c9-25e2f701db09",
            doorPassword: "142536",
            createdAt: "2025-04-08T13:28:16.707Z",
            updatedAt: "2025-04-08T13:39:38.831Z",
        },
        {
            _id: "67f524709d038e32b7f7f2ee",
            deviceId: "e8bb95b2-a275-4278-aeb5-5b4135b2970a",
            configId: "7d858f06-2898-4a40-b4c9-25e2f701db09",
            doorPassword: "142536",
            createdAt: "2025-04-08T13:28:16.707Z",
            updatedAt: "2025-04-08T13:39:38.831Z",
        },
        {
            _id: "67f524709d038e32b7f7f2ee",
            deviceId: "e8bb95b2-a275-4278-aeb5-5b4135b2970a",
            configId: "7d858f06-2898-4a40-b4c9-25e2f701db09",
            doorPassword: "142536",
            createdAt: "2025-04-08T13:28:16.707Z",
            updatedAt: "2025-04-08T13:39:38.831Z",
        },
        {
            _id: "67f524709d038e32b7f7f2ee",
            deviceId: "e8bb95b2-a275-4278-aeb5-5b4135b2970a",
            configId: "7d858f06-2898-4a40-b4c9-25e2f701db09",
            doorPassword: "142536",
            createdAt: "2025-04-08T13:28:16.707Z",
            updatedAt: "2025-04-08T13:39:38.831Z",
        },
        {
            _id: "67f524709d038e32b7f7f2ee",
            deviceId: "e8bb95b2-a275-4278-aeb5-5b4135b2970a",
            configId: "7d858f06-2898-4a40-b4c9-25e2f701db09",
            doorPassword: "142536",
            createdAt: "2025-04-08T13:28:16.707Z",
            updatedAt: "2025-04-08T13:39:38.831Z",
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Door Controls</Text>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "ViewInfo" && styles.activeTab]}
                    onPress={() => setActiveTab("ViewInfo")}
                >
                    <Text style={styles.tabText}>View Information</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === "Actions" && styles.activeTab]}
                    onPress={() => setActiveTab("Actions")}
                >
                    <Text style={styles.tabText}>Reset Password</Text>
                </TouchableOpacity>
            </View>

            {/* View Info Tab */}
            {activeTab === "ViewInfo" && (
                <ScrollView style={{ marginTop: 10 }}>
                    {doorData.map((door, index) => (
                        <View key={door._id + index} style={styles.infoBox}>
                            <Text style={styles.infoText}>
                                <Text style={styles.label}>Device ID:</Text> {door.deviceId}
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.label}>Door Password:</Text> {door.doorPassword}
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.label}>Created At:</Text> {new Date(door.createdAt).toLocaleString()}
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.label}>Updated At:</Text> {new Date(door.updatedAt).toLocaleString()}
                            </Text>
                            <Text style={styles.infoText}>
                                <Text style={styles.label}>Config ID:</Text> {door.configId}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}

            {activeTab === "Actions" && (
                <ScrollView style={{ marginTop: 10 }}>
                    <View style={styles.list}>
                        {doorData.map((door, index) => (
                            <View key={door._id + index} style={styles.conditionRow}>
                                <View>
                                    <Text style={styles.conditionText}>Door ID: {door.deviceId}</Text>
                                </View>

                                <View style={styles.actionButtonsRow}>
                                    <ShareButton
                                        title="Reset Password"
                                        onPress={() => console.log("Reset Password")}
                                        buttonStyle={[styles.icon]}
                                        textStyle={{ color: "white" }}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}


            {/* Add New Door Button */}

        </View>
    );
};

export default DoorControlPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 50,
        backgroundColor: "white",
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    tabContainer: {
        flexDirection: "row",
        marginBottom: 10,
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#27ae60",
        borderRadius: 8,
    },
    tabText: {
        color: "white",
        fontWeight: "bold",
        flexDirection: "column",
        alignItems: "center",
    },
    addBtn: {
        backgroundColor: "#ededed",
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 6,
        marginBottom: 10,
    },
    addText: {
        color: "#333",
        fontWeight: "500",
    },
    list: {
        marginTop: 5,
        gap: 10,

    },
    conditionRow: {
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f9f9f9",
        padding: 20,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        gap: 15,
        alignItems: "center",
        borderRadius: 8,
        // borderWidth: 0.2,
    },
    conditionText: {
        fontSize: 16,
    },
    actionIcons: {
        flexDirection: "row",
    },
    icon: {
        backgroundColor: "#2ecc71",
        padding: 6,
        borderRadius: 4,
        marginLeft: 8,
    },
    deleteIcon: {
        backgroundColor: "#f39c12",
    },
    infoBox: {
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        padding: 16,
        marginTop: 10,
        elevation: 1,
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: "#333",
    },
    label: {
        fontWeight: "bold",
        color: "#000",
    },
    actionButtonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        gap: 12,
    },

    buttonFlex: {
        flex: 1,
        alignItems: "center",
    },
});
