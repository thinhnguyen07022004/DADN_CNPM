
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
}