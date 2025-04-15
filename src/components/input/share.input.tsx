import { APP_COLOR } from "@/utils/constant";
import { useState } from "react";
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const styles = StyleSheet.create({
    InputGroup: {
        padding: 5,
        gap: 10
    },
    InputText: {
        fontSize: 18,

    },
    Input: {
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10
    },
    eye: {
        position: "absolute",
        right: 10,
        top: 18
    }
})

interface IProps {
    title?: string;
    keyboardType?: KeyboardTypeOptions,
    secureTextEntry?: boolean,
    value: any,
    setValue?: (v: any) => void

}

const ShareInput = (props: IProps) => {
    const { title, keyboardType, secureTextEntry = false,
        value, setValue
    } = props
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    return (
        <View style={styles.InputGroup} >
            <Text style={styles.InputText}>{title}</Text>
            <View>
                <TextInput
                    value={value}
                    onChangeText={(text) => setValue && setValue(text)}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    keyboardType={keyboardType}
                    style={[styles.Input,
                    { borderColor: isFocus ? APP_COLOR.GREEN : APP_COLOR.GREY }
                    ]}
                    secureTextEntry={secureTextEntry && !isShowPassword} />
                {secureTextEntry &&
                    <FontAwesome5
                        style={styles.eye}
                        name={isShowPassword ? "eye" : "eye-slash"} size={15} color="black"
                        onPress={() => setIsShowPassword(!isShowPassword)}
                    />
                }
            </View>
        </View >
    )
}

export default ShareInput