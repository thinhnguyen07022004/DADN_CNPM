import HomeHeader from "@/components/home/home.header"
import { Slot, Stack } from "expo-router"
import { Text, View } from "react-native"

const RootLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <Stack.Screen
                name="index"
                options={{ headerShown: false }} />

            <Stack.Screen
                name="(auth)/signup"
                options={{ headerShown: false }} />

            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }} />

            <Stack.Screen
                name="product/index"
                options={{ headerTitle: "Sản phẩm" }} />
            <Stack.Screen
                name="environment-status"
                options={{
                    // header: () => <HomeHeader />,
                    headerTitle: () => <HomeHeader />,
                    headerStyle: {
                        backgroundColor: '#00651f',
                    }
                }} />

            <Stack.Screen
                name="(auth)/login"
                options={{ headerShown: false }} />
        </Stack>
    )
}

export default RootLayout