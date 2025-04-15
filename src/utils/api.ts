import axios from "@/utils/axios.customize";
import { AxiosResponse } from "axios";

const registerAPI = ( phoneNumber: string, password: string, name: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`;
    return axios.post<IRegister>(url, { phoneNumber, password, name });
}

const logInAPI = ( phoneNumber: string, password: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/login`;
    return axios.post<ILogin>(url, { phoneNumber, password });
}

const getConfigAPI = ( userId: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/config`;
    return axios.get<IConfig>(url, { params: { userId } });
}

const addConfigAPI = ( userId: string, iotName: string, iotApiKey: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/config`;
    return axios.post<IConfig>(url, { userId, iotName, iotApiKey });
}

const fetchSingleLightFeedAPI = (
    iotName: string,
    apiKey: string,
    limit: number
): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/lightfeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    params: { limit },
});
};

const fetchSingleTemperatureFeedAPI = (
    iotName: string,
    apiKey: string,
    limit: number
): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/temperaturefeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    params: { limit },
});
};

const fetchSingleHumidityFeedAPI = (
    iotName: string,
    apiKey: string,
    limit: number
): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/humidityfeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    params: { limit },
});
};

export {
    registerAPI,
    logInAPI,
    getConfigAPI, addConfigAPI,
    fetchSingleLightFeedAPI, fetchSingleTemperatureFeedAPI, fetchSingleHumidityFeedAPI
}

