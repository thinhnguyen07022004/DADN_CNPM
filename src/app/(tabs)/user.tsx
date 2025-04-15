import { useCurrentApp } from "@/context/app.context"
import { Image, Platform, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import avatar from "@/assets/auth/avatar-icon-6.jpg"
import ShareInput from "@/components/input/share.input"

const AccountPage = () => {
    const { appState, config } = useCurrentApp()


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, gap: 10, marginHorizontal: 20 }}>
                <View style={{ alignItems: "center", gap: 5 }}>
                    <Image
                        style={{ width: 150, height: 150 }}
                        source={avatar}
                    />
                    {/* <Text>{appState?.name}</Text> */}
                </View>
                <View style={{ marginTop: 20, gap: 20 }}>
                    <ShareInput
                        title="Họ và tên"
                        value={appState?.name}
                    />
                    <ShareInput
                        title="Iot Name"
                        value={config?.iotName}
                    />
                    <ShareInput
                        title="Iot Api Key"
                        value={config?.iotApiKey}
                    />
                    <ShareInput
                        title="Số điện thoại"
                        value={appState?.phoneNumber?.toString()}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AccountPage