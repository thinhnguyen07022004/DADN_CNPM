import { useCurrentApp } from "@/context/app.context";
import { fetchSingleLightFeedAPI } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

// Định nghĩa giao diện ILightFeed
interface ILightFeed {
    id: string;
    value: string;
    feed_id: number;
    feed_key: string;
    created_at: string;
    created_epoch: number;
    expiration: string;
}

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundGradientFrom: "#e0f7fa", // Màu nền gradient nhẹ
    backgroundGradientTo: "#ffffff", // Chuyển sang trắng
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 105, 192, ${opacity})`, // Màu đường: xanh dương
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#004d40", // Màu viền điểm
    },
    propsForLabels: {
        fontSize: 12,
        fill: "#333333", // Màu chữ nhãn
    },
};

const ReportPage = () => {
    const { config } = useCurrentApp();
    const [chartData, setChartData] = useState({
        labels: [] as string[],
        datasets: [{ data: [] as number[] }],
    });

    useEffect(() => {
        if (config?.iotName && config?.iotApiKey) {
            const lightFeedData = async () => {
                try {
                    const res: ILightFeed[] = await fetchSingleLightFeedAPI(
                        config.iotName,
                        config.iotApiKey,
                        10
                    );
                    const filteredData = res
                        .filter((item: ILightFeed) => !isNaN(parseFloat(item.value))) // Lọc các giá trị số hợp lệ
                        .sort(
                            (a: ILightFeed, b: ILightFeed) =>
                                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                        );

                    // Tạo nhãn và dữ liệu
                    const labels = filteredData.map((item: ILightFeed, index: number) => {
                        if (index % 2 === 0) {
                            return new Date(item.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            });
                        }
                        return "";
                    });
                    const data = filteredData.map((item: ILightFeed) => parseFloat(item.value));

                    // Cập nhật trạng thái biểu đồ
                    setChartData({
                        labels,
                        datasets: [{ data }],
                    });
                } catch (err) {
                    console.error("Fetch lightfeed error:", err);
                }
            };
            lightFeedData();
        }
    }, [config?.iotName, config?.iotApiKey]);

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
            {chartData.labels.length > 0 ? (
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
            ) : (
                <Text style={{ textAlign: "center" }}>Đang tải dữ liệu...</Text>
            )}
        </ScrollView>
    );
};

export default ReportPage;