import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { APP_COLOR } from '@/utils/constant';

const initialData = {
    configId: '7d858f06-2898-4a40-b4c9-25e2f701db09',
    controlledMode: 'Automatic',
    fanOns: [
        { intensity: '75', threshold: '32' },
        { intensity: '100', threshold: '35' },
        { intensity: '75', threshold: '32' },
        { intensity: '100', threshold: '35' },
        { intensity: '75', threshold: '32' },
        { intensity: '100', threshold: '35' },
        { intensity: '75', threshold: '32' },
        { intensity: '100', threshold: '35' },
    ],
};

const FanConfigScreen = () => {
    const [config, setConfig] = useState(initialData);

    const updateFanOn = (index: number, key: 'intensity' | 'threshold', value: string) => {
        const updatedFanOns = [...config.fanOns];
        updatedFanOns[index][key] = value;
        setConfig({ ...config, fanOns: updatedFanOns });
    };

    const handleUpdate = () => {
        // gọi API ở đây
        console.log('Sending config:', config);
        // Gọi API update tại đây, ví dụ: axios.post('/api/updateFan', config)
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Fan Configuration</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Controlled Mode:</Text>
                <Text style={styles.value}>{config.controlledMode}</Text>
            </View>

            {config.fanOns.map((fan, index) => (
                <View key={index} style={styles.fanBox}>
                    <Text style={styles.subHeader}>Fan #{index + 1}</Text>
                    <TextInput
                        style={styles.input}
                        value={fan.intensity}
                        onChangeText={(value) => updateFanOn(index, 'intensity', value)}
                        placeholder="Intensity"
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        value={fan.threshold}
                        onChangeText={(value) => updateFanOn(index, 'threshold', value)}
                        placeholder="Threshold"
                        keyboardType="numeric"
                    />
                </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update Fan Config</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#f5f5f5', flexGrow: 1 },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    label: { fontSize: 16, color: '#555' },
    value: { fontSize: 16, color: '#333', fontWeight: '600' },
    fanBox: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    subHeader: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: APP_COLOR.GREEN,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default FanConfigScreen;
