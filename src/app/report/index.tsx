import { useCurrentApp } from "@/context/app.context";
import {
    fetchSingleLightFeedAPI,
    fetchSingleTemperatureFeedAPI,
    fetchSingleHumidityFeedAPI,
} from "@/utils/api";
import React, { useEffect, useRef, useState } from "react";
import { Text, ScrollView } from "react-native";
import LineChart from "@/components/lineChart/line.chart.data";
import { MQTTClient } from "@/utils/mqtt";

// Cấu hình biểu đồ cho độ sáng
const lightChartConfig = {
    backgroundGradientFrom: "#e0f7fa", // Xanh nhạt
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 105, 192, ${opacity})`, // Xanh dương
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#004d40",
    },
    propsForLabels: {
        fontSize: 12,
        fill: "#333333",
    },
};

// Cấu hình biểu đồ cho nhiệt độ
const temperatureChartConfig = {
    backgroundGradientFrom: "#ffebee", // Đỏ nhạt
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(211, 47, 47, ${opacity})`, // Đỏ
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#b71c1c",
    },
    propsForLabels: {
        fontSize: 12,
        fill: "#333333",
    },
};

// Cấu hình biểu đồ cho độ ẩm
const humidityChartConfig = {
    backgroundGradientFrom: "#e8f5e9", // Xanh lá nhạt
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`, // Xanh lá
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#1b5e20",
    },
    propsForLabels: {
        fontSize: 12,
        fill: "#333333",
    },
};

const ReportPage = () => {
    const { config } = useCurrentApp();
    const [lightChartData, setLightChartData] = useState({
        labels: [] as string[],
        datasets: [{ data: [] as number[] }],
    });
    const [temperatureChartData, setTemperatureChartData] = useState({
        labels: [] as string[],
        datasets: [{ data: [] as number[] }],
    });
    const [humidityChartData, setHumidityChartData] = useState({
        labels: [] as string[],
        datasets: [{ data: [] as number[] }],
    });

    useEffect(() => {
        if (config?.iotName && config?.iotApiKey) {
            // Hàm xử lý dữ liệu chung
            const processFeedData = (
                data: IFeed[],
                setChartData: React.Dispatch<
                    React.SetStateAction<{
                        labels: string[];
                        datasets: { data: number[] }[];
                    }>
                >
            ) => {
                const filteredData = data
                    .filter(item => !isNaN(parseFloat(item.value)))
                    .sort(
                        (a, b) =>
                            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    );

                const labels = filteredData.map((item, index) => {
                    if (index % 2 === 0) {
                        return new Date(item.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                    }
                    return "";
                });
                const chartValues = filteredData.map(item => parseFloat(item.value));

                setChartData({
                    labels,
                    datasets: [{ data: chartValues }],
                });
            };

            // Hàm fetch dữ liệu
            const fetchData = async () => {
                try {
                    const [lightRes, tempRes, humidRes] = await Promise.all([
                        fetchSingleLightFeedAPI(config.iotName, config.iotApiKey, 10),
                        fetchSingleTemperatureFeedAPI(config.iotName, config.iotApiKey, 10),
                        fetchSingleHumidityFeedAPI(config.iotName, config.iotApiKey, 10),
                    ]);

                    processFeedData(lightRes, setLightChartData);
                    processFeedData(tempRes, setTemperatureChartData);
                    processFeedData(humidRes, setHumidityChartData);
                } catch (err) {
                    console.error("Fetch feed error:", err);
                }
            };

            // Gọi ngay lần đầu
            fetchData();

            // Cập nhật mỗi 5 giây
            const interval = setInterval(() => {
                fetchData();
                console.log("Fetching data every 5 seconds...");
            }, 5000); // 5000ms = 5 giây

            // Dọn dẹp interval khi component unmount
            return () => clearInterval(interval);
        }
    }, [config?.iotName, config?.iotApiKey]);

    return (
        <ScrollView>
            <Text
                style={{
                    fontSize: 20,
                    textAlign: "center",
                    marginVertical: 16,
                    fontWeight: "bold",
                }}
            >
                Biểu đồ độ sáng
            </Text>
            {lightChartData.labels.length > 0 ? (
                <LineChart chartData={lightChartData} chartConfig={lightChartConfig} />
            ) : (
                <Text style={{ textAlign: "center" }}>Đang tải dữ liệu độ sáng...</Text>
            )}

            <Text
                style={{
                    fontSize: 20,
                    textAlign: "center",
                    marginVertical: 16,
                    fontWeight: "bold",
                }}
            >
                Biểu đồ nhiệt độ
            </Text>
            {temperatureChartData.labels.length > 0 ? (
                <LineChart
                    chartData={temperatureChartData}
                    chartConfig={temperatureChartConfig}
                />
            ) : (
                <Text style={{ textAlign: "center" }}>Đang tải dữ liệu nhiệt độ...</Text>
            )}

            <Text
                style={{
                    fontSize: 20,
                    textAlign: "center",
                    marginVertical: 16,
                    fontWeight: "bold",
                }}
            >
                Biểu đồ độ ẩm
            </Text>
            {humidityChartData.labels.length > 0 ? (
                <LineChart
                    chartData={humidityChartData}
                    chartConfig={humidityChartConfig}
                />
            ) : (
                <Text style={{ textAlign: "center" }}>Đang tải dữ liệu độ ẩm...</Text>
            )}
        </ScrollView>
    );
};

export default ReportPage;