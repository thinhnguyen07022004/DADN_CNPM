import { StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
    // default : display flex
    container: {
        flex: 1,
        marginTop: 40,
        borderWidth: 1,
        borderColor: "red",

        // flexDirection: "row",
        justifyContent: "center", // ox
        alignItems: "center"      // oy

        // flexDirection: "column",
        // justifyContent: "center", // oy
        // alignItems: "center"      // ox
    },
    item1: {
        padding: 20,
        borderWidth: 1,
        backgroundColor: "violet"
    },

    item2: {
        padding: 20,
        borderWidth: 1,
        backgroundColor: "green"
    },
    item3: {
        padding: 20,
        borderWidth: 1,
        backgroundColor: "orange"
    },
    item4: {
        padding: 20,
        borderWidth: 1,
        backgroundColor: "grey"
    },
})

const FlexBox = () => {
    return (
        <>
            <View style={styles.container}>
                <View >
                    <Text style={styles.item1}>Item1</Text>
                </View>
                <View >
                    <Text style={styles.item2}>Item2</Text>
                </View>
                <View >
                    <Text style={styles.item3}>Item3</Text>
                </View>
                <View >
                    <Text style={styles.item4}>Item4</Text>
                </View>
            </View>
        </>
    )
}

export default FlexBox