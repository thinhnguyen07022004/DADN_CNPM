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

interface IProps {
    title: string;
    subTitle: string;
    color?: string;
}
const HomeTitle = (props: IProps) => {
    const { title, subTitle, color = "white" } = props
    return (
        <View style={styles.container}>
            <Text style={[styles.body, { color }]}>{title}</Text>
            <Text style={[styles.footer, { color }]}>{subTitle}</Text>
        </View>
    )
}

export default HomeTitle