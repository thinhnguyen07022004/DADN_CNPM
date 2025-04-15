import React from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface LightFeedChartProps {
    chartData: {
        labels: string[];
        datasets: { data: number[] }[];
    };
    chartConfig: {
        backgroundGradientFrom: string;
        backgroundGradientTo: string;
        backgroundGradientToOpacity?: number;
        color: (opacity?: number) => string;
        strokeWidth: number;
        decimalPlaces: number;
        propsForDots?: {
            r: string;
            strokeWidth: string;
            stroke: string;
        };
        propsForLabels?: {
            fontSize: number;
            fill: string;
        };
    };
}

const LightFeedChart: React.FC<LightFeedChartProps> = ({
    chartData,
    chartConfig,
}) => {
    return (
        <View>
            <LineChart
                data={chartData}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{
                    borderRadius: 16,
                    marginVertical: 8,
                }}
            />
        </View>
    );
};

export default LightFeedChart;