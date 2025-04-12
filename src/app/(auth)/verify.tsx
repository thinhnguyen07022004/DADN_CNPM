import ShareButton from "@/components/button/share.button"
import SocialButton from "@/components/button/social.button"
import ShareInput from "@/components/input/share.input"
import { APP_COLOR } from "@/utils/constant"
import { Link } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const styles = StyleSheet.create({
    contanier: {
        flex: 1,
        gap: 10,
        marginHorizontal: 20
    },

})

const VerifyPage = () => {
    const [userId, setUserId] = useState<string>("");
    const [iotName, setIotName] = useState<string>("");
    const [iotApiKey, setIotApiKey] = useState<string>("");

    // const handleSignUp = async () => {
    //     const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`;
    //     try {
    //         const res = await registerAPI(phoneNumber, password, name);
    //         if (res.data) {
    //             router.navigate("/(auth)/verify")
    //         } else {
    //             // const m = Array.isArray(res.message)
    //             //     ? res.message[0] : res.message;
    //             Toast.show("Đăng ký thất bại", {
    //                 duration: Toast.durations.LONG,
    //                 textColor: "#fff",
    //                 backgroundColor: "red",
    //                 opacity: 1,
    //             });
    //         }

    //     } catch (error) {
    //         console.log(">>>>check error:", error)
    //     }
    // }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.contanier}>
                <View >
                    <Text style={{
                        fontSize: 25,
                        fontWeight: 600,
                        marginVertical: 30
                    }}
                    >Cấu hình Adafruit</Text>
                </View>
                <ShareInput
                    title="userId"
                    value={userId}
                    setValue={setUserId}
                />
                <ShareInput
                    title="iotName"
                    value={iotName}
                    setValue={setIotName}
                />
                <ShareInput
                    title="iotApiKey"
                    value={iotApiKey}
                    setValue={setIotApiKey}
                />
                <View style={{ marginVertical: 10 }}></View>
                <ShareButton
                    title="Đăng Ký"
                    onPress={() => alert("me")}
                    textStyle={{
                        textTransform: "uppercase",
                        color: "#fff",
                        paddingVertical: 5
                    }}
                    buttonStyle={{
                        justifyContent: "center",
                        borderRadius: 30,
                        marginHorizontal: 50,
                        paddingHorizontal: 10,
                        backgroundColor: APP_COLOR.GREEN,
                    }}
                    pressStyle={{ alignSelf: "stretch" }}
                />
            </View>
        </SafeAreaView>
    )
}

export default VerifyPage