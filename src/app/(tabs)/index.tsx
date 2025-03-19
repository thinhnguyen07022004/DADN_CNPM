import CustomFlatList from "@/components/CustomFlatList/CustomFlatList";
import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import bg from "@/assets/home/background_app.png";
import HomeHeader from "@/components/home/home.header";
import HomeItems from "@/components/home/home.items";
import HomeTopList from "@/components/home/home.top.list";

const HomeTab = () => {

    return (
        <ImageBackground source={bg} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <CustomFlatList
                    data={[1] as const}
                    style={styles.list}
                    renderItem={() => <HomeTopList />}
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
        flex: 1
    },
    list: {
        overflow: "hidden",
    },
});

export default HomeTab;