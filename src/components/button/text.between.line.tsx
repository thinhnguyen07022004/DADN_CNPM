import { StyleSheet, StyleProp, Text, View, TextStyle } from "react-native";

const styles = StyleSheet.create({
    text: {
        color: "black",
        position: "relative",
        top: 10
    },
})

interface IProps {
    title: string;
    textStyle?: StyleProp<TextStyle>;
}
const TextBetweenLine = (props: IProps) => {
    const { title, textStyle } = props;
    return (
        <View style={{
            flexDirection: "row",
            gap: 15,
            justifyContent: "center",
        }}>
            <View style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                paddingHorizontal: 35,
            }}>
            </View>
            <Text style={[styles.text, textStyle]}>{title}</Text>
            <View style={{
                borderBottomColor: "#ccc",
                borderBottomWidth: 1,
                paddingHorizontal: 35,
            }}>
            </View>
        </View>
    )
}

export default TextBetweenLine