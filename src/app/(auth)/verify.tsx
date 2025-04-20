import ShareButton from "@/components/button/share.button"
import ShareInput from "@/components/input/share.input"
import { useCurrentApp } from "@/context/app.context"
import { addConfigAPI } from "@/utils/api"
import { APP_COLOR } from "@/utils/constant"
import { router } from "expo-router"
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

const VerifyPage = () => {
    const { appState } = useCurrentApp()
    const [iotName, setIotName] = useState<string>("");
    const [iotApiKey, setIotApiKey] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleVerify = async () => {
        try {
            if (appState?.id) {
                setLoading(true);
                const res = await addConfigAPI(appState.id, iotName, iotApiKey);
                if (res) {
                    router.navigate("/(auth)/login")
                    Toast.show("Configuration Successful", {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: APP_COLOR.GREEN,
                        opacity: 1,
                    });
                } else {
                    Toast.show("Configuration Failed", {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: "red",
                        opacity: 1,
                    });
                }
            }
        }
        catch (error) {
            Toast.show("Configuration failed", {
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
                    >Configuration Adafruit</Text>
                </View>
                <ShareInput
                    title="userId"
                    value={appState?.id}
                    disabled={true}
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
                    title="Configuration"
                    onPress={() => handleVerify()}
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