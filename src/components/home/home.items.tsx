import { StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    body: {
        fontSize: 25,
        fontWeight: "600",
        color: "white",
        marginTop: 10,

    },
    footer: {
        fontSize: 15,
        color: "white",
        fontWeight: "500",
        marginVertical: 10,
    }
})
const HomeItems = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.body}>Suga Marketing Farm</Text>
            <Text style={styles.footer}>Online</Text>
        </View>
    )
}

export default HomeItems