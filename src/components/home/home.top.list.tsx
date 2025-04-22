import { Link, Href } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { APP_COLOR } from "@/utils/constant";

type AppRoutes =
    | "/remote-control"
    | "/schedule"
    | "/fan-control"
    | "/report"
    | "/report-table"
    | "/technique";

interface GridItem {
    id: string;
    iconName: React.ComponentProps<typeof FontAwesome5>['name']
    label: string;
    href: Href<AppRoutes>;
}

const gridItems: GridItem[] = [
    { id: "1", iconName: "remote", label: "Remote Control", href: "/remote-control" },
    { id: "2", iconName: "chart-bar", label: "Data Chart", href: "/report" },
    { id: "3", iconName: "table", label: "Data Table", href: "/report-table" },
    { id: "4", iconName: "door-closed", label: "Door Controls", href: "/door" },
    { id: "5", iconName: "fan", label: "Fan Controls", href: "/fan-control" },
    { id: "6", iconName: "lightbulb", label: "Light Controls", href: "/light-control" },
    { id: "7", iconName: "cloud-rain", label: "Misting Controls", href: "/misting-control" },
];

const HomeTopList = () => {
    return (
        <View style={styles.gridContainer}>
            <FlatList
                data={gridItems}
                renderItem={({ item }) => (
                    <Link href={item.href} asChild>
                        <TouchableOpacity style={styles.gridItem}>
                            {item.id === "1" ? (
                                <MaterialCommunityIcons name={item.iconName} style={styles.icon} />
                            ) : (
                                <FontAwesome5 name={item.iconName} style={styles.icon} />
                            )}
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
}

const styles = StyleSheet.create({
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
        borderRadius: 20,
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
        fontSize: 50,
        marginBottom: 5,
        color: APP_COLOR.GREEN
    },
    label: {
        fontSize: 14,
        textAlign: "center",
        color: "#333",
    },
})

export default HomeTopList