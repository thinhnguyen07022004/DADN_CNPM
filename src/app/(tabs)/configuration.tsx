import ShareButton from "@/components/button/share.button"
import ShareInput from "@/components/input/share.input"
import LoadingOverlay from "@/components/loading/overlay"
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

const ConfigPage = () => {
    const { config } = useCurrentApp()
    const { appState } = useCurrentApp()
    const [iotName, setIotName] = useState<string>("");
    const [iotApiKey, setIotApiKey] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleVerify = async () => {
        try {
            if (appState?.id) {
                setLoading(true);
                const res = await addConfigAPI(appState.id, iotName, iotApiKey);
                setLoading(false);

                if (res) {
                    router.navigate("/(tabs)")
                    Toast.show("Cấu hình thành công", {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: APP_COLOR.GREEN,
                        opacity: 1,
                    });
                } else {
                    Toast.show("Cấu hình thất bại", {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: "red",
                        opacity: 1,
                    });
                }
            }
        }
        catch (error) {
            Toast.show("Đăng nhập thất bại", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
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
                    >Cấu hình thông tin thiết bị</Text>
                </View>
                <ShareInput
                    title="userId"
                    value={appState?.id}
                    disabled={true}
                />
                <ShareInput
                    title="iotName"
                    value={iotName || config?.iotName}
                    setValue={setIotName}
                    disabled={config?.iotName ? true : false}
                />
                <ShareInput
                    title="iotApiKey"
                    value={iotApiKey || config?.iotApiKey}
                    setValue={setIotApiKey}
                    disabled={config?.iotApiKey ? true : false}
                />
                <View style={{ marginVertical: 140 }}></View>

                {appState?.id && !config?.iotName && !config?.iotApiKey
                    ?
                    <ShareButton
                        title="Xác nhận"
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
                            width: "80%",
                        }}
                        pressStyle={{ alignSelf: "stretch" }}
                    />
                    :
                    <></>
                }
            </View>
            {loading && <LoadingOverlay />}
        </SafeAreaView>
    )
}

export default ConfigPage