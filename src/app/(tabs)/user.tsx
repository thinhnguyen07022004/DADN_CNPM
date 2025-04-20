import { useCurrentApp } from "@/context/app.context"
import { Image, View } from "react-native"
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
                </View>

                <View style={{ marginTop: 20, gap: 20 }}>
                    <ShareInput
                        title="Full Name"
                        value={appState?.name}
                        disabled={true}
                    />
                    <ShareInput
                        title="Iot Name"
                        value={config?.iotName}
                        disabled={true}
                    />
                    <ShareInput
                        title="Iot Api Key"
                        value={config?.iotApiKey}
                        disabled={true}
                    />
                    <ShareInput
                        title="Phone Number"
                        value={appState?.phoneNumber?.toString()}
                        disabled={true}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default AccountPage