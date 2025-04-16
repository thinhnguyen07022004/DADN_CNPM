import axios from "@/utils/axios.customize";
import { AxiosResponse } from "axios";

//! Authenticate API
const registerAPI = ( phoneNumber: string, password: string, name: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`;
    return axios.post<IRegister>(url, { phoneNumber, password, name });
}

const logInAPI = ( phoneNumber: string, password: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/login`;
    return axios.post<ILogin>(url, { phoneNumber, password });
}

//! Config API
const getConfigAPI = ( userId: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/config`;
    return axios.get<IConfig>(url, { params: { userId } });
}

const addConfigAPI = ( userId: string, iotName: string, iotApiKey: string) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/config`;
    return axios.post<IConfig>(url, { userId, iotName, iotApiKey });
}

//! DOOR API
const getDoorAPI = ( configId: string ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/door`;
    return axios.get<IDoor>(url, { params: { configId } });
}

const updateDoorAPI = (
    configId: string,
    doorPassword: string,
    ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/door`;

    return axios.patch<IDoor>(url, {
        configId,
        doorPassword,
    });
}

//! FAN API
const getFanAPI = ( configId: string ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/fan`;
    return axios.get<IFan>(url, { params: { configId } });
}

const updateFanAPI = (
    configId: string,
    controlledMode: string,
    fanOns: FanOn[]
    ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/fan`;

    return axios.patch<IConfig>(url, {
        configId,
        controlledMode,
        fanOns,
    });
};

//! LIGHT API
const getLightAPI = ( configId: string ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/light`;
    return axios.get<IFan>(url, { params: { configId } });
}

const updateLightAPI = (
    configId: string,
    controlledMode: string,
    onTime: string,
    offTime: string,
    lightsOns: lightOns[]
    ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/light`;

    return axios.patch<IConfig>(url, {
        configId,
        controlledMode,
        onTime,
        offTime,
        lightsOns,
    });
};

//! MISTING API

const getMistingAPI = ( configId: string ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/misting`;
    return axios.get<IFan>(url, { params: { configId } });
}

const updateMistingAPI = (
    configId: string,
    controlledMode: string,
    mistingOns: lightOns[]
    ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/light`;

    return axios.patch<IConfig>(url, {
        configId,
        controlledMode,
        mistingOns,
    });
};

//! SENSOR RECORD API

const getSensorRecordAPI = ( configId: string ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/records`;
    return axios.get<IFan>(url, { params: { configId } });
}

const updateSensorRecordAPI = (
    configId: string,
    controlledMode: string,
    mistingOns: lightOns[]
    ) => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/records`;

    return axios.patch<IConfig>(url, {
        configId,
        controlledMode,
        mistingOns,
    });
};

//! Fetching LightFeed data from Adafruit IO API
const fetchSingleLightFeedAPI = (iotName: string, apiKey: string, limit: number): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/lightfeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    params: { limit },
});
};

const fetchAllLightFeedAPI = (iotName: string,apiKey: string): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/lightfeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    }
});
};

const fetchLightFeedInTimeRangeAPI = (iotName: string, apiKey: string, limit: number, start_time: Date, end_time: Date): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/lightfeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    params: { 
        limit,
        start_time: start_time.toISOString(),
        end_time: end_time.toISOString(),
    },
    });
};

const fetchLightFeedSinceAPI = (iotName: string, apiKey: string, limit: number, start_time: Date): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/lightfeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    params: { 
        limit,
        start_time: start_time.toISOString(),
    },
    });
};

//! Fetching TemperatureFeed data from Adafruit IO API
const fetchSingleTemperatureFeedAPI = (iotName: string,apiKey: string,limit: number): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/temperaturefeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    params: { limit },
    });
};

const fetchAllTemperatureFeedAPI = (iotName: string,apiKey: string): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/temperaturefeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    });
};

const fetchTemperatureFeedInTimeRangeAPI = (iotName: string, apiKey: string, limit: number, start_time: Date, end_time: Date): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/temperaturefeed/data`;
    return axios.get<IFeed[]>(url, {
        headers: {
            "X-AIO-Key": apiKey,
        },
        params: {
            limit,
            start_time: start_time.toISOString(),
            end_time: end_time.toISOString(),
        },
    });
};

const fetchTemperatureFeedSinceAPI = (iotName: string, apiKey: string, limit: number, start_time: Date): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/temperaturefeed/data`;
    return axios.get<IFeed[]>(url, {
        headers: {
            "X-AIO-Key": apiKey,
        },
        params: {
            limit,
            start_time: start_time.toISOString(),
        },
    });
};

//! Fetching HumidityFeed data from Adafruit IO API
const fetchSingleHumidityFeedAPI = (iotName: string,apiKey: string,limit: number): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/humidityfeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    params: { limit },
    });
};

const fetchAllHumidityFeedAPI = (iotName: string,apiKey: string): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/humidityfeed/data`;
    return axios.get<IFeed[]>(url, {
    headers: {
        "X-AIO-Key": apiKey,
    },
    });
};

const fetchHumidityFeedInTimeRangeAPI = (iotName: string, apiKey: string, limit: number, start_time: Date, end_time: Date): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/humidityfeed/data`;
    return axios.get<IFeed[]>(url, {
        headers: {
            "X-AIO-Key": apiKey,
        },
        params: {
            limit,
            start_time: start_time.toISOString(),
            end_time: end_time.toISOString(),
        },
    });
};

const fetchHumidityFeedSinceAPI = (iotName: string, apiKey: string, limit: number, start_time: Date): Promise<AxiosResponse<IFeed[]>> => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/humidityfeed/data`;
    return axios.get<IFeed[]>(url, {
        headers: {
            "X-AIO-Key": apiKey,
        },
        params: {
            limit,
            start_time: start_time.toISOString(),
        },
    });
};

//! Automated devices controller
const feetControllerAPI = (value: string, iotName: string, apiKey: string) => {
    const url = `${process.env.EXPO_PUBLIC_ADAFRUIT_API_URL}/${iotName}/feeds/automatedfeed/data`;
    return axios.post<IFeed[]>(url, 
        { value },
        { headers: { "X-AIO-Key": apiKey } });
}

export {
    registerAPI,
    logInAPI,
    getConfigAPI, addConfigAPI,
    getDoorAPI, updateDoorAPI,
    getFanAPI, updateFanAPI,
    getLightAPI, updateLightAPI,
    getMistingAPI, updateMistingAPI,
    getSensorRecordAPI, updateSensorRecordAPI,
    fetchSingleLightFeedAPI, fetchSingleTemperatureFeedAPI, fetchSingleHumidityFeedAPI,
    fetchAllLightFeedAPI, fetchAllTemperatureFeedAPI, fetchAllHumidityFeedAPI,
    fetchLightFeedInTimeRangeAPI, fetchLightFeedSinceAPI,
    fetchTemperatureFeedInTimeRangeAPI, fetchTemperatureFeedSinceAPI,
    fetchHumidityFeedInTimeRangeAPI, fetchHumidityFeedSinceAPI,
    feetControllerAPI,
}

