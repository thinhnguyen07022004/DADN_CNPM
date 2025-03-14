import CustomFlatList from "@/components/CustomFlatList/CustomFlatList";
import { FlatList, ImageBackground, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import bg from "@/assets/home/background_app.png";
import HomeHeader from "@/components/home/home.header";
import HomeItems from "@/components/home/home.items";
import { Link } from "expo-router";

// Định nghĩa các route literal cụ thể
type AppRoutes =
    | "/remote-control"
    | "/environment-status"
    | "/schedule"
    | "/history"
    | "/script"
    | "/technique";

// Định nghĩa kiểu Href dựa trên AppRoutes
type Href = AppRoutes | { pathname: AppRoutes; params?: Record<string, string> | undefined };

// Định nghĩa interface cho grid item
interface GridItem {
    id: string;
    icon: string;
    label: string;
    href: Href; // Sử dụng Href với các route cụ thể
}

// Khai báo gridItems với kiểu rõ ràng
const gridItems: GridItem[] = [
    { id: "1", icon: "🏠", label: "Remote Control", href: "/remote-control" },
    { id: "2", icon: "🌱", label: "Environment Status", href: "/environment-status" },
    { id: "3", icon: "📅", label: "Schedule", href: "/schedule" },
    { id: "4", icon: "⏳", label: "History", href: "/history" },
    { id: "5", icon: "📜", label: "Script", href: "/script" },
    { id: "6", icon: "⚙️", label: "Technique", href: "/technique" },
];

const HomeTab = () => {
    const GridComponent = () => {
        return (
            <View style={styles.gridContainer}>
                <FlatList
                    data={gridItems}
                    renderItem={({ item }) => (
                        <Link href={item.href} asChild>
                            <TouchableOpacity style={styles.gridItem}>
                                <Text style={styles.icon}>{item.icon}</Text>
                                <Text style={styles.label}>{item.label}</Text>
                            </TouchableOpacity>
                        </Link>
                    )}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.gridContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    };

    return (
        <ImageBackground source={bg} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <CustomFlatList
                    data={[1] as const}
                    style={styles.list}
                    renderItem={() => <GridComponent />}
                    HeaderComponent={<HomeHeader />}
                    StickyElementComponent={<HomeItems />}
                    TopListElementComponent={<></>}
                />
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        overflow: "hidden",
        padding: 8,
        marginHorizontal: 10,
    },
    list: {
        overflow: "hidden",
    },
    gridContainer: {
        padding: 10,
    },
    gridContent: {
        paddingBottom: 10,
    },
    row: {
        justifyContent: "space-around",
    },
    gridItem: {
        width: "45%",
        aspectRatio: 1,
        backgroundColor: "#fff",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    icon: {
        fontSize: 30,
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        textAlign: "center",
        color: "#333",
    },
});

export default HomeTab;