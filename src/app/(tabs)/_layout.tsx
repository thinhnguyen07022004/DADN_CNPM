import { Tabs } from "expo-router"
import Octions from '@expo/vector-icons/Octicons';
import { APP_COLOR } from "@/utils/constant";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabLayout = () => {

    const getIcons = (routeName: string, focused: boolean, size: number) => {
        if (routeName === "index") {
            return (
                <FontAwesome5
                    name="home"
                    size={size}
                    color={focused ? APP_COLOR.GREEN : APP_COLOR.GREY}
                />
            )
        }

        if (routeName === "lock") {
            return (focused ?
                <Entypo name="lock-open" size={size} color={APP_COLOR.GREEN} />
                :
                <Entypo name="lock" size={24} color={APP_COLOR.GREY} />
            )
        }

        if (routeName === "history") {
            return (focused ?
                <FontAwesome name="history" size={size} color={APP_COLOR.GREEN} />
                :
                <FontAwesome name="history" size={size} color={APP_COLOR.GREY} />

            )
        }
        if (routeName === "user") {
            return (focused ?
                <FontAwesome name="user" size={size} color={APP_COLOR.GREEN} />
                :
                <FontAwesome name="user" size={size} color={APP_COLOR.GREY} />
            )
        }
        return (
            <></>
        )
    }

    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    return getIcons(route.name, focused, size);
                },
                headerShown: false,
                tabBarLabelStyle: { paddingBottom: 3 },
                tabBarActiveTintColor: APP_COLOR.GREEN

            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home"
                }}
            />

            <Tabs.Screen
                name="lock"
                options={{
                    title: "Lock"
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History"
                }}
            />

            <Tabs.Screen
                name="user"
                options={{
                    title: "User"
                }}
            />

        </Tabs>
    )
}

export default TabLayout