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
import { useCurrentApp } from "@/context/app.context"

const styles = StyleSheet.create({
    contanier: {
        flex: 1,
        gap: 10,
        marginHorizontal: 20
    },
})

const SignUpPage = () => {
    const { setAppState } = useCurrentApp()
    const [name, setName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);


    const handleSignUp = async () => {
        try {
            setLoading(true);
            const res = await registerAPI(phoneNumber, password, name);
            if (res && res.error) {
                Toast.show(res.message, {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: "red",
                    opacity: 1,
                });
                return;
            };
            if (res && res.data) {
                setAppState(res.data)
                router.navigate("/(auth)/verify")
                Toast.show("Registration Successful", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: APP_COLOR.GREEN,
                    opacity: 1,
                });
            } else {
                Toast.show("Registration Failed", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: "red",
                    opacity: 1,
                });
            }
        } catch (error) {
            Toast.show("Registration Failed", {
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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.contanier}>
                <View >
                    <Text style={{
                        fontSize: 25,
                        fontWeight: 600,
                        marginVertical: 30
                    }}
                    >SIGN UP</Text>
                </View>
                <ShareInput
                    title="Full name"
                    value={name}
                    setValue={setName}
                />
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
                    title="Sign Up"
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
                        Already have an account?
                    </Text>
                    <Link href={"/(auth)/login"}>
                        <Text style={{
                            textAlign: "center",
                            color: APP_COLOR.GREEN,
                            textDecorationLine: "underline"
                        }}>
                            Sign In.
                        </Text>
                    </Link>
                </View>

                <SocialButton
                    title="Sign up with" />
            </View>
        </SafeAreaView>
    )
}

export default SignUpPage