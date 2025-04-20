import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";

interface IProps {
    onPress: (action: string, type: "open" | "reset") => void | Promise<void>;
}

const ButtonFunction = ({ onPress }: IProps) => {
    const buttons: { label: string, action: string, type: "open" | "reset" }[] = [
        { label: "Exit", action: "#", type: "open" },
        { label: "Clear all", action: "*", type: "open" },
        { label: "Delete 1 character", action: "-", type: "open" },
    ];

    return (
        <View style={styles.functionButtons}>
            {buttons.map((btn, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.functionButton}
                    onPress={() => onPress(btn.action, btn.type)}
                >
                    <Text style={styles.functionButtonText}>{btn.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
export default ButtonFunction

const styles = StyleSheet.create({
    functionButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
        marginBottom: 20,
    },
    functionButton: {
        backgroundColor: "#FFCDD2",
        padding: 10,
        borderRadius: 8,
    },
    functionButtonText: {
        fontSize: 14,
        color: "#D32F2F",
        fontWeight: "600",
    },
})