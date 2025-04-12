import HomeHeader from "@/components/home/home.header"
import { APP_COLOR } from "@/utils/constant"
import { Stack } from "expo-router"
import { RootSiblingParent } from 'react-native-root-siblings';

const RootLayout = () => {
    return (
        <RootSiblingParent>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: APP_COLOR.GREEN,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTitleAlign: "center"
                }}>
                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }} />

                <Stack.Screen
                    name="(auth)/signup"
                    options={{ headerShown: false }} />

                <Stack.Screen
                    name="(auth)/verify"
                    options={{ headerShown: false }} />

                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }} />

                <Stack.Screen
                    name="product/index"
                    options={{ headerTitle: "Sản phẩm" }} />

                <Stack.Screen
                    name="remote-control/index"
                    options={{
                        headerTitle: () => <HomeHeader />,
                    }}
                />

                <Stack.Screen
                    name="environment-status/index"
                    options={{
                        headerTitle: () => <HomeHeader />,
                    }}
                />

                <Stack.Screen
                    name="schedule/index"
                    options={{
                        headerTitle: () => <HomeHeader />,
                    }}
                />

                <Stack.Screen
                    name="history/index"
                    options={{
                        headerTitle: () => <HomeHeader />,
                    }}
                />

                <Stack.Screen
                    name="script/index"
                    options={{
                        headerTitle: () => <HomeHeader />,
                    }}
                />

                <Stack.Screen
                    name="technique/index"
                    options={{
                        headerTitle: () => <HomeHeader />,
                    }}
                />

                <Stack.Screen
                    name="(auth)/login"
                    options={{ headerShown: false }} />
            </Stack>
        </RootSiblingParent>
    )
}

export default RootLayout