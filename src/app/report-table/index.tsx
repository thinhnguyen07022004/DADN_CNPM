import React, { useState, useEffect, memo } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import axios, { AxiosResponse } from "axios";
import { FontAwesome5 } from "@expo/vector-icons";
import { useCurrentApp } from "@/context/app.context";
import { fetchAllHumidityFeedAPI, fetchAllLightFeedAPI, fetchAllTemperatureFeedAPI } from "@/utils/api";
import { APP_COLOR } from "@/utils/constant";

// Định nghĩa interface cho dữ liệu feed
interface IFeed {
    id: string;
    value: string;
    feed_id: number;
    feed_key: string;
    created_at: string;
    created_epoch: number;
    expiration: string;
    formattedCreatedAt?: string;
    formattedExpiration?: string;
}

// Format dữ liệu trước khi render
const formatFeedData = (data: IFeed[]): IFeed[] => {
    return data.map((item) => ({
        ...item,
        formattedCreatedAt: new Date(item.created_at).toLocaleString(),
        formattedExpiration: new Date(item.expiration).toLocaleString(),
    }));
};

const FeedItem = memo(({ item }: { item: IFeed }) => (
    <View style={styles.card}>
        <View style={styles.infoRow}>
            <FontAwesome5 name="lightbulb" size={20} color="#F4511E" style={styles.icon} />
            <Text style={styles.infoLabel}>Value</Text>
            <Text style={styles.infoValueOrange}>{item.value}</Text>
        </View>
        <View style={styles.infoRow}>
            <FontAwesome5 name="clock" size={20} color="#388E3C" style={styles.icon} />
            <Text style={styles.infoLabel}>Created At</Text>
            <Text style={styles.infoValueGreen}>{item.formattedCreatedAt}</Text>
        </View>
        <View style={styles.infoRow}>
            <FontAwesome5 name="hourglass-end" size={20} color="#388E3C" style={styles.icon} />
            <Text style={styles.infoLabel}>Expiration</Text>
            <Text style={styles.infoValueGreen}>{item.formattedExpiration}</Text>
        </View>
    </View>
));

FeedItem.displayName = "FeedItem";

const DataTablePage = () => {
    const { config } = useCurrentApp();
    const [activeTab, setActiveTab] = useState<"light" | "temperature" | "humidity">("light");
    const [lightData, setLightData] = useState<IFeed[]>([]);
    const [temperatureData, setTemperatureData] = useState<IFeed[]>([]);
    const [humidityData, setHumidityData] = useState<IFeed[]>([]);
    const [lightPage, setLightPage] = useState(1);
    const [tempPage, setTempPage] = useState(1);
    const [humidPage, setHumidPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 50;

    const [allLightData, setAllLightData] = useState<IFeed[]>([]);
    const [allTemperatureData, setAllTemperatureData] = useState<IFeed[]>([]);
    const [allHumidityData, setAllHumidityData] = useState<IFeed[]>([]);

    const iotName = config?.iotName;
    const apiKey = config?.iotApiKey;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            if (!iotName || !apiKey) {
                setError("Vui lòng kiểm tra thông tin IoT Name và API Key.");
                setLoading(false);
                return;
            }
            try {
                const [lightRes, tempRes, humidRes] = await Promise.all([
                    fetchAllLightFeedAPI(iotName, apiKey),
                    fetchAllTemperatureFeedAPI(iotName, apiKey),
                    fetchAllHumidityFeedAPI(iotName, apiKey),
                ]);

                const lightDataArray = Array.isArray(lightRes) ? formatFeedData(lightRes) : [];
                const tempDataArray = Array.isArray(tempRes) ? formatFeedData(tempRes) : [];
                const humidDataArray = Array.isArray(humidRes) ? formatFeedData(humidRes) : [];

                setAllLightData(lightDataArray);
                setAllTemperatureData(tempDataArray);
                setAllHumidityData(humidDataArray);

                // Hiển thị trang đầu tiên
                setLightData(lightDataArray.slice(0, itemsPerPage));
                setTemperatureData(tempDataArray.slice(0, itemsPerPage));
                setHumidityData(humidDataArray.slice(0, itemsPerPage));
            } catch (err: any) {
                setError("Không thể tải dữ liệu. Vui lòng kiểm tra kết nối hoặc thông tin API.");
            } finally {
                setLoading(false);
            }

        };
        fetchData();

        const interval = setInterval(() => {
            fetchData();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const loadMoreData = async () => {
        if (loadingMore || loading) return;

        setLoadingMore(true);
        try {
            if (activeTab === "light") {
                const nextPageData = allLightData.slice(lightPage * itemsPerPage, (lightPage + 1) * itemsPerPage);
                if (nextPageData.length > 0) {
                    setLightData((prev) => [...prev, ...nextPageData]);
                    setLightPage((prev) => prev + 1);
                }
            } else if (activeTab === "temperature") {
                const nextPageData = allTemperatureData.slice(tempPage * itemsPerPage, (tempPage + 1) * itemsPerPage);
                if (nextPageData.length > 0) {
                    setTemperatureData((prev) => [...prev, ...nextPageData]);
                    setTempPage((prev) => prev + 1);
                }
            } else if (activeTab === "humidity") {
                const nextPageData = allHumidityData.slice(humidPage * itemsPerPage, (humidPage + 1) * itemsPerPage);
                if (nextPageData.length > 0) {
                    setHumidityData((prev) => [...prev, ...nextPageData]);
                    setHumidPage((prev) => prev + 1);
                }
            }
        } catch (err: any) {
            console.error("Error loading more data:", err.message);
        } finally {
            setLoadingMore(false);
        }
    };

    // Dữ liệu hiển thị dựa trên tab đang chọn
    const dataToShow = activeTab === "light" ? lightData : activeTab === "temperature" ? temperatureData : humidityData;

    // Render mỗi mục trong danh sách
    const renderItem = ({ item }: { item: IFeed }) => <FeedItem item={item} />;

    return (
        <View style={styles.container}>
            {/* <Text style={styles.title}>Report Table</Text */}

            {/* Tab navigation */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "light" && styles.activeTab]}
                    onPress={() => setActiveTab("light")}
                >
                    <Text style={[styles.tabText, activeTab === "light" && styles.activeTabText]}>
                        Light Data
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "temperature" && styles.activeTab]}
                    onPress={() => setActiveTab("temperature")}
                >
                    <Text style={[styles.tabText, activeTab === "temperature" && styles.activeTabText]}>
                        Temperature Data
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === "humidity" && styles.activeTab]}
                    onPress={() => setActiveTab("humidity")}
                >
                    <Text style={[styles.tabText, activeTab === "humidity" && styles.activeTabText]}>
                        Humidity Data
                    </Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#FFFFFF" style={styles.loader} />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : dataToShow.length > 0 ? (
                <FlatList
                    data={dataToShow}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                    ListFooterComponent={
                        loadingMore ? (
                            <ActivityIndicator size="small" color="#FFFFFF" style={styles.loaderMore} />
                        ) : (
                            <View style={{ height: 20 }} />
                        )
                    }
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.5}
                />
            ) : (
                <Text style={styles.noDataText}>Không có dữ liệu để hiển thị.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: APP_COLOR.GREEN,
        paddingTop: 20,
    },
    title: {
        fontSize: 22,
        color: APP_COLOR.GREEN,
        fontWeight: "bold",
        marginLeft: 16,
        marginBottom: 16,
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        marginBottom: 16,
    },
    tab: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 4,
    },
    activeTab: {
        backgroundColor: "#F4511E",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    activeTabText: {
        color: "#FFFFFF",
    },
    list: {
        flex: 1,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
    loader: {
        marginTop: 20,
    },
    loaderMore: {
        marginVertical: 10,
    },
    noDataText: {
        fontSize: 16,
        color: "#FFFFFF",
        textAlign: "center",
        marginTop: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#FFEBEE",
        textAlign: "center",
        marginTop: 20,
    },
});

export default DataTablePage;