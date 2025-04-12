import ShareButton from "@/components/button/share.button"
import SocialButton from "@/components/button/social.button"
import ShareInput from "@/components/input/share.input"
import { APP_COLOR } from "@/utils/constant"
import { Link, router } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Toast from 'react-native-root-toast';
import { registerAPI } from "@/utils/api"

const styles = StyleSheet.create({
    contanier: {
        flex: 1,
        gap: 10,
        marginHorizontal: 20
    },

})

const SignUpPage = () => {
    const [name, setName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignUp = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`;
        try {
            const res = await registerAPI(phoneNumber, password, name);
            if (res.data) {
                router.navigate("/(auth)/verify")
            } else {
                // const m = Array.isArray(res.message)
                //     ? res.message[0] : res.message;
                Toast.show("Đăng ký thất bại", {
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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.contanier}>
                <View >
                    <Text style={{
                        fontSize: 25,
                        fontWeight: 600,
                        marginVertical: 30
                    }}
                    >Đăng ký tài khoản</Text>
                </View>
                <ShareInput
                    title="Họ tên"
                    value={name}
                    setValue={setName}
                />
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
                    title="Đăng Ký"
                    onPress={() => handleSignUp()}
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
                        Đã có tài khoản?
                    </Text>
                    <Link href={"/(auth)/login"}>
                        <Text style={{
                            textAlign: "center",
                            color: APP_COLOR.GREEN,
                            textDecorationLine: "underline"
                        }}>
                            Đăng nhập.
                        </Text>
                    </Link>
                </View>

                <SocialButton
                    title="Đăng ký với" />
            </View>
        </SafeAreaView>
    )
}

export default SignUpPage