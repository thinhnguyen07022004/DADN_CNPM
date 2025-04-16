import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface ThermometerProps {
    temperature: number;
    min?: number;
    max?: number;
}

const Thermometer: React.FC<ThermometerProps> = ({ temperature, min = 0, max = 50 }) => {
    const height = 200;
    const width = 10;

    const clampedTemp = Math.max(min, Math.min(max, temperature));
    const fillHeight = ((clampedTemp - min) / (max - min)) * height;

    return (
        <View style={styles.container}>
            <Text style={styles.tempText}>{temperature.toFixed(1)}°C</Text>
            <Svg height={height} width={width}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="1" x2="0" y2="0">
                        <Stop offset="0" stopColor="#00BCD4" />
                        <Stop offset="0.5" stopColor="#FFEB3B" />
                        <Stop offset="1" stopColor="#F44336" />
                    </LinearGradient>
                </Defs>
                <Rect
                    x="0"
                    y="0"
                    width={width}
                    height={height}
                    rx="10"
                    ry="10"
                    fill="#eee"
                    stroke="#ccc"
                    strokeWidth="2"
                />
                <Rect
                    x="0"
                    y={height - fillHeight}
                    width={width}
                    height={fillHeight}
                    rx="10"
                    ry="10"
                    fill="url(#grad)"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 16,
    },
    tempText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
});

export default Thermometer;
