
export {};
declare global {
    interface IBackendRes {
        
    }

    interface IRegister {
        id: string,
        phoneNumber: number,
        name: string,
        _id: string,
        createdAt: string,
        updatedAt: string,
        error?: string | string[];
    }

    interface ILogin {
        _id: string,
        id: string,
        phoneNumber: number,
        name: string,
        createdAt: string,
        updatedAt: string,
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

    interface IFeed {
        id: string,
        value: string,
        feed_id: number,
        feed_key: string,
        created_at: string,
        created_epoch: number,
        expiration: string
    }

}