import axios from "@/utils/axios.customize";

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

export {
    registerAPI,
    logInAPI,
    getConfigAPI
}

