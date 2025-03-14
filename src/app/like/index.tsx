import { useNavigation } from "expo-router"
import { Button, Text, View } from "react-native"
import LikeDetails from "./like.details";

const Like = () => {
    const navigation: any = useNavigation();
    return (
        <View>
            <Text>Like Components</Text>
            <Button
                onPress={() => navigation.navigate({ LikeDetails })}
                title="like details" />
        </View>
    )
}

export default Like