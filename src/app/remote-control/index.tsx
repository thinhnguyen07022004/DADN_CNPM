import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { APP_COLOR } from '@/utils/constant';
import OTPTextView from 'react-native-otp-textinput';
import LoadingOverlay from '@/components/loading/overlay';
import { useCurrentApp } from '@/context/app.context';
import { getDoorAPI, remoteControllerAPI, updatePasswordAPI } from '@/utils/api';
import Toast from 'react-native-root-toast';
import { router } from 'expo-router';
import ShareButton from '@/components/button/share.button';

const RemoteControlPage = () => {
    const { config } = useCurrentApp()
    const [isSubmit, setIsSubmit] = useState(false);
    const [doorPassword, setDoorPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState<string | null>(null);
    const otpRef = useRef<OTPTextView>(null);

    useEffect(() => {
        const fetchDoorData = async () => {
            try {
                if (!config?.id || !config?.iotApiKey || !config?.iotName) {
                    router.navigate("/(tabs)/configuration")
                    Toast.show("Người dùng chưa cấu hình tài khoản", {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: "red",
                        opacity: 1,
                    });
                    return;
                }
                setIsSubmit(true);
                const response = await getDoorAPI(config?.id);
                // @ts-ignore:next-line
                const doorData = response[0]
                // console.log(">>>check response", doorData);
                setDoorPassword(doorData?.doorPassword);
                // console.log(">>>check response doorPassword", doorPassword);
                if (!response?.doorPassword) {
                    const res = await updatePasswordAPI(doorPassword, config?.iotName, config?.iotApiKey);
                    // console.log(">>>check updatePasswordAPI", res);
                } else {
                    Toast.show("Người dùng chưa thêm dữ liệu cửa và hệ thốngthống", {
                        duration: Toast.durations.LONG,
                        textColor: "#fff",
                        backgroundColor: "red",
                        opacity: 1,
                    });
                }
            } catch (err) {
                Toast.show("Người dùng chưa thêm dữ liệu cửa và hệ thốngthống", {
                    duration: Toast.durations.LONG,
                    textColor: "#fff",
                    backgroundColor: "red",
                    opacity: 1,
                });
                console.error(err);
            } finally {
                setIsSubmit(false);
            }
        };

        fetchDoorData();
    }, []);

    const handleSubmit = async () => {
        if (!config?.id || !config?.iotApiKey || !config?.iotName) {
            Toast.show("Người dùng chưa cấu hình tài khoản", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            router.navigate("/(tabs)/configuration")
            return;
        }
        try {
            setIsSubmit(true);
            const res = await remoteControllerAPI(otp, config?.iotName, config?.iotApiKey);
            console.log(">>>check remoteControllerAPI", res);
            Keyboard.dismiss();
            setOtp('');
            Toast.show("Gửi tín hiệu thành công", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: APP_COLOR.GREEN,
                opacity: 1,
            });
        } catch (err) {
            Toast.show("Không thể gửi tín hiệu đi", {
                duration: Toast.durations.LONG,
                textColor: "#fff",
                backgroundColor: "red",
                opacity: 1,
            });
            console.error(err);
        } finally {
            otpRef.current?.clear();
            setIsSubmit(false);
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.heading}>Remote Control</Text>
                <OTPTextView
                    ref={otpRef}
                    handleTextChange={setOtp}
                    inputCount={6}
                    inputCellLength={1}
                    tintColor={APP_COLOR.GREEN}
                    textInputStyle={{
                        borderWidth: 1,
                        borderColor: APP_COLOR.GREY,
                        borderBottomWidth: 1,
                        borderRadius: 5,
                        // @ts-ignore:next-line
                        color: APP_COLOR.GREEN,
                    }}
                />
            </View>
            <ShareButton
                loading={isSubmit}
                title="Sent"
                onPress={() => handleSubmit()}
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
            {isSubmit && <LoadingOverlay />}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    heading: {
        fontSize: 25,
        fontWeight: "600",
        marginVertical: 20,
    }
});

export default RemoteControlPage;
