import { ImageBackground, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import bg from "@/assets/home/background_app.png";

const LockPage = () => {
    return (

        <ImageBackground source={bg} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                {/* <CustomFlatList
                data={[1] as const}
                style={styles.list}
                renderItem={() => <HomeTopList />}
                HeaderComponent={<HomeHeader />}
                StickyElementComponent={<HomeItems />}
                TopListElementComponent={<></>}
            /> */}
                <Text>Lock Page</Text>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        overflow: "hidden",
        padding: 8,
        marginHorizontal: 10,
        flex: 1
    },
});

export default LockPage