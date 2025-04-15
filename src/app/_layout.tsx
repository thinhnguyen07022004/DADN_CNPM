import HomeHeader from "@/components/home/home.header"
import AppProvider from "@/context/app.context";
import { APP_COLOR } from "@/utils/constant"
import { Stack } from "expo-router"
import { RootSiblingParent } from 'react-native-root-siblings';

const RootLayout = () => {
    return (
        <RootSiblingParent>
            <AppProvider>
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
                        name="door/index"
                        options={{
                            headerTitle: () => <HomeHeader />,
                        }}
                    />

                    <Stack.Screen
                        name="report/index"
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
                        name="fan-control/index"
                        options={{
                            headerTitle: () => <HomeHeader />,
                        }}
                    />

                    <Stack.Screen
                        name="(auth)/login"
                        options={{ headerShown: false }} />
                </Stack>
            </AppProvider>
        </RootSiblingParent>
    )
}

export default RootLayout