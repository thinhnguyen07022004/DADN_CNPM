import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface ThermometerProps {
    mistingSensor: number;
    min?: number;
    max?: number;
}

const MistingSensor: React.FC<ThermometerProps> = ({ mistingSensor, min = 0, max = 100 }) => {
    const height = 200;
    const width = 10;

    const validTemp = isNaN(mistingSensor) || mistingSensor === undefined ? min : mistingSensor;

    const clampedTemp = Math.max(min, Math.min(max, validTemp));

    const fillHeight = max > min ? ((clampedTemp - min) / (max - min)) * height : 0;
    const yPosition = height - fillHeight;

    return (
        <View style={styles.container}>
            <Text style={styles.tempText}>{clampedTemp} %</Text>
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
                    y={isNaN(yPosition) ? height : yPosition}
                    width={width}
                    height={isNaN(fillHeight) ? 0 : fillHeight}
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

export default MistingSensor;