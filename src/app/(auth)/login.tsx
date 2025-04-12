import ShareButton from "@/components/button/share.button"
import SocialButton from "@/components/button/social.button"
import ShareInput from "@/components/input/share.input"
import { logInAPI } from "@/utils/api"
import { APP_COLOR } from "@/utils/constant"
import { Link, router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Toast from "react-native-root-toast"
import { SafeAreaView } from "react-native-safe-area-context"

const styles = StyleSheet.create({
    contanier: {
        flex: 1,
        gap: 10,
        marginHorizontal: 20
    },

})

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            const res = await logInAPI(phoneNumber, password);
            setLoading(false);
            if (res) {
                router.navigate("/(tabs)")
            } else {
                Toast.show("Đăng nhập thất bại", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: "red",
                    opacity: 1,
                });
            }

        } catch (error) {
            console.log(">>>>check error:", error)
        }
    }

    return (
        <SafeAreaView style={{
            marginVertical: 50,
            flex: 1
        }}>
            <View style={styles.contanier}>
                <View >
                    <Text style={{
                        fontSize: 25,
                        fontWeight: 600,
                        marginVertical: 30
                    }}
                    >Đăng nhập</Text>
                </View>
                <ShareInput
                    title="Số điện thoại"
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                />
                <ShareInput
                    title="Mật khẩu"
                    secureTextEntry={true}
                    value={password}
                    setValue={setPassword}
                />
                <View style={{ marginVertical: 10 }}></View>
                <ShareButton
                    loading={loading}
                    title="Đăng nhập"
                    onPress={() => handleLogin()}
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

                <View style={{
                    marginVertical: 15,
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center"
                }}>
                    <Text style={{
                        textAlign: "center",
                        color: "black"
                    }}>
                        Chưa có tài khoản?
                    </Text>
                    <Link href={"/(auth)/signup"}>
                        <Text style={{
                            textAlign: "center",
                            color: APP_COLOR.GREEN,
                            textDecorationLine: "underline"
                        }}>
                            Đăng ký.
                        </Text>
                    </Link>
                </View>

                <SocialButton
                    title="Đăng nhập với" />
            </View>
        </SafeAreaView>
    )
}

export default Login