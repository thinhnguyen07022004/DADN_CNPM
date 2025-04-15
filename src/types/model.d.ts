
export {};
declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message?: string;
        statusCode?: number | string;
        data?: T;
    }

    interface IRegister {
        id: string,
        phoneNumber: number,
        name: string,
        _id: string,
        createdAt: Date,
        updatedAt: Date,
    }

    interface ILogin {
        _id: string,
        id: string,
        phoneNumber: number,
        name: string,
        createdAt: Date,
        updatedAt: Date,
    }

    interface IConfig{
        _id: string,
        id: string,
        iotName: string,
        iotApiKey: string,
        userId: string,
        createdAt: Date,
        updatedAt: Date,
    }
}