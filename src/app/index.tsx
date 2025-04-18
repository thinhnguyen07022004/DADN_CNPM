import { Image, ImageBackground, StyleSheet, Text, View } from "react-native"
import ShareButton from "components/button/share.button"
import iconFarm from '@/assets/auth/farm_logo.png'
import bgfarm from '@/assets/auth/background.png'
import falogo from '@/assets/auth/facebook.png'
import gglogo from '@/assets/auth/google.png'
import { LinearGradient } from 'expo-linear-gradient';
import TextBetweenLine from "@/components/button/text.between.line";
import { Link, Redirect, router } from "expo-router";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,

    },
    welcomeText: {
        flex: 0.6,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingLeft: 20,
    },
    welcomeButton: {
        flex: 0.4,
        gap: 30
    },
    header: {
        fontSize: 60,
        fontWeight: "600",
        color: "white"
    },
    body: {
        fontSize: 30,
        fontWeight: "600",
        color: "#FFAA00",
        marginVertical: 30,
        marginLeft: 90

    },
    footer: {
        color: "white",
    },

})
const WelcomePage = () => {
    // if (true) {
    //     return (
    //         <Redirect href={"/remote-control"} />
    //     )
    // }
    return (
        <ImageBackground
            style={{ flex: 1 }}
            source={bgfarm}
        >
            <LinearGradient
                style={{ flex: 1 }}
                colors={['transparent', '#191B2F']}
                locations={[0.2, 0.8]}
            >
                <View style={styles.container}>
                    <View style={styles.welcomeText}>
                        <Text style={styles.header}>
                            Welcome to
                        </Text>
                        <View style={{
                            flexDirection: "row",
                        }}>
                            <Image
                                style={{
                                    width: 100,
                                    height: 100,
                                    position: "absolute",
                                    left: -20,
                                    top: 15
                                }}
                                source={iconFarm} />
                            <Text style={styles.body}>
                                HiFarm | Smart Farm Solution
                            </Text>
                        </View>
                        <Text style={styles.footer}>
                            Nông trại thông minh - Hiệu quả cao - Tiết kiệm chi phí
                        </Text>
                    </View>
                    <View style={styles.welcomeButton}>
                        <TextBetweenLine
                            textStyle={{ color: "white" }}
                            title="Đăng nhập với" />
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
                        <View>
                            <ShareButton
                                title="Đăng nhập với số điện thoại"
                                onPress={() => router.navigate("/login")}
                                textStyle={{ color: "#fff", paddingVertical: 5 }}
                                buttonStyle={{
                                    justifyContent: "center",
                                    borderRadius: 30,
                                    marginHorizontal: 50,
                                    paddingHorizontal: 10,
                                    backgroundColor: "#2c2c2c",
                                    borderColor: "#505050",
                                    borderWidth: 1
                                }}
                                pressStyle={{ alignSelf: "stretch" }}
                            />
                        </View>
                        <View style={{
                            flexDirection: "row",
                            gap: 10,
                            justifyContent: "center"
                        }}>
                            <Text style={{
                                textAlign: "center",
                                color: "white"
                            }}>
                                Chưa có tài khoản?
                            </Text>
                            <Link href={"/(auth)/signup"}>
                                <Text style={{
                                    textAlign: "center",
                                    color: "white",
                                    textDecorationLine: "underline"
                                }}>
                                    Đăng ký.
                                </Text>
                            </Link>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>

    )
}

export default WelcomePage