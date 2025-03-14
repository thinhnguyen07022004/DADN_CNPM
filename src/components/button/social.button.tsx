import { Image, StyleSheet, View } from "react-native"
import TextBetweenLine from "./text.between.line"
import ShareButton from "./share.button"
import falogo from '@/assets/auth/facebook.png'
import gglogo from '@/assets/auth/google.png'

const styles = StyleSheet.create({
    welcomeButton: {
        flex: 1,
        gap: 30
    },
})
interface IProps {
    title: string;
}
const SocialButton = (props: IProps) => {
    const { title } = props
    return (
        <View style={styles.welcomeButton}>
            <TextBetweenLine
                title={title}
                textStyle={{ color: "black" }} />
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                gap: 30,
            }}>
                <ShareButton
                    title="Facebook"
                    onPress={() => alert("me")}
                    textStyle={{ textTransform: "uppercase" }}
                    buttonStyle={{
                        justifyContent: "center",
                        borderRadius: 30,
                        backgroundColor: "#fff"
                    }}
                    icon={
                        <Image source={falogo} />
                    }
                />
                <ShareButton
                    title="Google"
                    onPress={() => alert("me")}
                    textStyle={{ textTransform: "uppercase" }}
                    buttonStyle={{
                        justifyContent: "center",
                        borderRadius: 30,
                        paddingHorizontal: 20,
                        backgroundColor: "#fff"
                    }}
                    icon={
                        <Image source={gglogo} />
                    }
                />
            </View>
        </View>
    )
}

export default SocialButton