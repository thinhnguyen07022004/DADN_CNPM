import ShareButton from "@/components/button/share.button"
import SocialButton from "@/components/button/social.button"
import ShareInput from "@/components/input/share.input"
import { useCurrentApp } from "@/context/app.context"
import { getConfigAPI, logInAPI } from "@/utils/api"
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
    const { setAppState, setConfig } = useCurrentApp()

    const handleLogin = async () => {
        try {
            setLoading(true);
            const res = await logInAPI(phoneNumber, password);
            if (res.data && res.data.id) {
                setAppState(res.data)
                const config = await getConfigAPI(res.data.id);
                if (config.data) {
                    setConfig(config.data);
                }
                router.navigate("/(tabs)")
                Toast.show("Login successful", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: APP_COLOR.GREEN,
                    opacity: 1,
                });
            } else {
                Toast.show("Login failed", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: "red",
                    opacity: 1,
                });
            }
        } catch (error) {
            Toast.show("Login failed", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
        }
        finally {
            setLoading(false);
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
                    >SIGN IN</Text>
                </View>
                <ShareInput
                    title="Phone Number"
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                />
                <ShareInput
                    title="PassWord"
                    secureTextEntry={true}
                    value={password}
                    setValue={setPassword}
                />
                <View style={{ marginVertical: 10 }}></View>
                <ShareButton
                    loading={loading}
                    title="Sign In"
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
                        Don't have an account?
                    </Text>
                    <Link href={"/(auth)/signup"}>
                        <Text style={{
                            textAlign: "center",
                            color: APP_COLOR.GREEN,
                            textDecorationLine: "underline"
                        }}>
                            Sign Up.
                        </Text>
                    </Link>
                </View>

                <SocialButton
                    title="Sign in with" />
            </View>
        </SafeAreaView>
    )
}

export default Login