import React from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
};

const ReportPage = () => {
    const data = {
        labels: ["10:30", "10:35", "10:40", "10:45"],
        datasets: [
            {
                data: [74, 76, 77, 78],
            },
        ],
    };

    return (
        <ScrollView>
            <Text
                style={{
                    fontSize: 20,
                    textAlign: "center",
                    marginVertical: 16,
                }}
            >
                Biểu đồ thay đổi
            </Text>
            <LineChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{
                    borderRadius: 16,
                    marginVertical: 8,
                }}
            />
        </ScrollView>
    );
};

export default ReportPage;
