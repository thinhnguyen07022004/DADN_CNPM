import { Image, StyleSheet, Text, View } from "react-native"
import iconFarm from '@/assets/auth/farm_logo.png'
const styles = StyleSheet.create({
    body: {
        fontSize: 20,
        fontWeight: "600",
        color: "white",
        marginLeft: 5

    },
})
const HomeHeader = () => {
    return (
        <View style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Image
                style={{
                    width: 35,
                    height: 35,
                }}
                source={iconFarm} />
            <Text style={styles.body}>
                HiFarm
            </Text>
        </View>
    )
}

export default HomeHeader