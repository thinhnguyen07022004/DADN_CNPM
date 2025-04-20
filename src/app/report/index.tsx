import { useCurrentApp } from "@/context/app.context";
import {
    fetchSingleLightFeedAPI,
    fetchSingleTemperatureFeedAPI,
    fetchSingleHumidityFeedAPI,
    fetchLightFeedInTimeRangeAPI,
    fetchTemperatureFeedInTimeRangeAPI,
    fetchHumidityFeedInTimeRangeAPI,
} from "@/utils/api";
import React, { useEffect, useRef, useState } from "react";
import { Text, ScrollView, StyleSheet, Switch } from "react-native";
import LineChart from "@/components/lineChart/line.chart.data";
import { Calendar } from "react-native-calendars";
import { View } from "react-native";
import LoadingOverlay from "@/components/loading/overlay";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const lightChartConfig = {
    backgroundGradientFrom: "#e0f7fa",
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 105, 192, ${opacity})`,
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

const temperatureChartConfig = {
    backgroundGradientFrom: "#ffebee",
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(211, 47, 47, ${opacity})`,
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

const humidityChartConfig = {
    backgroundGradientFrom: "#e8f5e9",
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
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
    const [dateRange, setDateRange] = useState<{
        startDate: Date | null;
        endDate: Date | null;
    }>({ startDate: null, endDate: null });
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

    const [isFilter, setIsFilter] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleFilter = () => {
        setIsFilter(previousState => !previousState);
        setDateRange({ startDate: null, endDate: null });
    };

    useEffect(() => {
        if (config?.iotName && config?.iotApiKey) {
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

            const fetchData = async () => {
                try {
                    let lightRes, tempRes, humidRes;

                    if (isFilter && dateRange.startDate && dateRange.endDate) {
                        const startTime = dayjs(dateRange.startDate).utc().format("YYYY-MM-DDTHH:mm[Z]");
                        const endTime = dayjs(dateRange.endDate).utc().format("YYYY-MM-0DDTHH:mm[Z]");
                        [lightRes, tempRes, humidRes] = await Promise.all([
                            fetchLightFeedInTimeRangeAPI(
                                config.iotName,
                                config.iotApiKey,
                                10,
                                startTime,
                                endTime
                            ),
                            fetchTemperatureFeedInTimeRangeAPI(
                                config.iotName,
                                config.iotApiKey,
                                10,
                                startTime,
                                endTime
                            ),
                            fetchHumidityFeedInTimeRangeAPI(
                                config.iotName,
                                config.iotApiKey,
                                10,
                                startTime,
                                endTime
                            ),

                        ]);
                    } else {
                        [lightRes, tempRes, humidRes] = await Promise.all([
                            fetchSingleLightFeedAPI(config.iotName, config.iotApiKey, 10),
                            fetchSingleTemperatureFeedAPI(config.iotName, config.iotApiKey, 10),
                            fetchSingleHumidityFeedAPI(config.iotName, config.iotApiKey, 10),
                        ]);
                    }
                    if (
                        lightRes.length === 0 &&
                        tempRes.length === 0 &&
                        humidRes.length === 0
                    ) {
                    } else {
                        processFeedData(lightRes, setLightChartData);
                        processFeedData(tempRes, setTemperatureChartData);
                        processFeedData(humidRes, setHumidityChartData);
                    }
                } catch (err) {
                    console.log("Unable to load data, please try again.");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();

            const interval = setInterval(() => {
                fetchData();
            }, 10000);

            return () => clearInterval(interval);
        }
    }, [config?.iotName, config?.iotApiKey, dateRange]);

    const markedDates: Record<string, {
        startingDay: boolean;
        endingDay: boolean;
        color: string;
        textColor: string;
        selected: boolean;
        selectedColor: string;
    }> = {};
    if (dateRange.startDate && dateRange.endDate) {
        const start = dayjs(dateRange.startDate);
        const end = dayjs(dateRange.endDate);
        let current = start;
        while (current <= end) {
            const dateStr = current.format("YYYY-MM-DD");
            markedDates[dateStr] = {
                startingDay: current.isSame(start, "day"),
                endingDay: current.isSame(end, "day"),
                color: "rgba(30, 144, 255, 0.2)",
                textColor: "#333",
                selected: true,
                selectedColor: current.isSame(start, "day") || current.isSame(end, "day") ? "#1E90FF" : "transparent",
            };
            current = current.add(1, "day");
        }
    }


    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.switchRow}>
                        <Text style={styles.label}>Filter in range time</Text>
                        <Switch
                            trackColor={{ false: "#B0BEC5", true: "#81C784" }}
                            thumbColor={isFilter ? "#FFFFFF" : "#ECEFF1"}
                            onValueChange={toggleFilter}
                            value={isFilter}
                        />
                    </View>
                </View>

                {isFilter &&
                    <View style={styles.datePickerContainer}>
                        <Calendar
                            initialDate="2025-04-01"
                            style={styles.calendarContainer}
                            theme={{
                                backgroundColor: "#fff",
                                calendarBackground: "#fff",
                                textSectionTitleColor: "#666",
                                textSectionTitleFontWeight: "500",
                                textSectionTitleFontSize: 14,
                                dayTextColor: "#333",
                                textDisabledColor: "#999",
                                monthTextColor: "#000",
                                textMonthFontSize: 18,
                                textMonthFontWeight: "bold",
                                arrowColor: "#1E90FF",
                            }}
                            onDayPress={(day: { dateString: string }) => {
                                const selectedDate = new Date(day.dateString);
                                if (
                                    !dateRange.startDate ||
                                    (dateRange.startDate && dateRange.endDate)
                                ) {
                                    setDateRange({ startDate: selectedDate, endDate: null });
                                } else if (dateRange.startDate && !dateRange.endDate) {
                                    if (selectedDate < dateRange.startDate) {
                                        setDateRange({
                                            startDate: selectedDate,
                                            endDate: dateRange.startDate,
                                        });
                                    } else {
                                        setDateRange({
                                            startDate: dateRange.startDate,
                                            endDate: selectedDate,
                                        });
                                    }
                                }
                            }}
                            markedDates={markedDates}
                            markingType="period"
                        />
                    </View>
                }

                {lightChartData.labels.length > 0 ? (
                    <LineChart chartData={lightChartData} chartConfig={lightChartConfig} />
                ) : (
                    <Text style={{ textAlign: "center" }}>Loading brightness data...</Text>
                )}
                <Text style={{ fontSize: 15, textAlign: "center", marginBottom: 20, marginTop: 5, fontWeight: 500 }}>
                    Light Chart Data Report
                </Text>


                {temperatureChartData.labels.length > 0 ? (
                    <LineChart
                        chartData={temperatureChartData}
                        chartConfig={temperatureChartConfig}
                    />
                ) : (
                    <Text style={{ textAlign: "center" }}>Loading temperature data...</Text>
                )}
                <Text style={{ fontSize: 15, textAlign: "center", marginBottom: 20, marginTop: 5, fontWeight: 500 }}>
                    Temperature Chart Data Report
                </Text>


                {humidityChartData.labels.length > 0 ? (
                    <LineChart
                        chartData={humidityChartData}
                        chartConfig={humidityChartConfig}
                    />
                ) : (
                    <Text style={{ textAlign: "center" }}>Loading humidity data...</Text>
                )}
                <Text style={{ fontSize: 15, textAlign: "center", marginBottom: 20, marginTop: 5, fontWeight: 500 }}>
                    Humidity Chart Data Report
                </Text>

            </View>
            {isLoading && <LoadingOverlay />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        // marginRight: 16,
    },
    card: {
        marginTop: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginLeft: 16,
        padding: 5,
        width: "92%",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
    },
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    label: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    datePickerContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: "#F9F9F9",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    calendarContainer: {
        borderRadius: 12,
        overflow: "hidden",
    },
    chartTitle: {
        fontSize: 20,
        textAlign: "center",
        marginVertical: 16,
        fontWeight: "bold",
        color: "#333",
    },
    noDataText: {
        textAlign: "center",
        color: "#666",
        fontSize: 16,
        marginBottom: 20,
    },
});


export default ReportPage;