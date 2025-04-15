import axios from "@/utils/axios.customize";
import { AxiosResponse } from "axios";

const registerAPI = ( phoneNumber: string, password: string, name: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`;
    return axios.post(url, { phoneNumber, password, name });
}

const logInAPI = ( phoneNumber: string, password: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/login`;
    return axios.post<ILogin>(url, { phoneNumber, password });
}

const getConfigAPI = ( userId: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/config`;
    return axios.get<IConfig>(url, { params: { userId } });
}

const fetchSingleLightFeedAPI = (
    iotName: string,
    apiKey: string,
    limit: number
): Promise<AxiosResponse<ILightFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/lightfeed/data`;
    return axios.get<ILightFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    params: { limit },
});
};

export {
    registerAPI,
    logInAPI,
    getConfigAPI,
    fetchSingleLightFeedAPI
}

