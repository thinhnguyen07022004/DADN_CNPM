
export {};
declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IRegister {
        id: string,
        phoneNumber: number,
        name: string,
        _id: string,
        createdAt: string,
        updatedAt: string,
    }

    interface ILogin {
        _id: string,
        id: string,
        phoneNumber: number,
        name: string,
        createdAt: string,
        updatedAt: string,
        configId: string
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

    interface IFan {
        _id: string,
        deviceId: string,
        configId: string,
        controlledMode: string,
        fanOns: [
            {
                intensity: number,
                threshold: number,
                _id: string
            },
        ],
        createdAt: string,
        updatedAt: string,
    }

    interface IFanOnAPI {
        intensity: string;
        threshold: string;
    }

    interface ILight {
        _id: string,
        deviceId: string,
        configId: string,
        controlledMode: string,
        lightOns: [
            {
                color: string,
                threshold: number,
                _id: string
            }
        ],
        createdAt: string,
        updatedAt: string,
        offTime: string,
        onTime: string
    }

    interface IMisting {
        _id: string,
        deviceId: string,
        configId: string,
        controlledMode: string,
        mistingOns: [
            {
                intensity: number,
                tempThreshold: number,
                moistureThreshold: number,
                _id: string
            }
        ],
        createdAt: string,
        updatedAt: string,
    }
    
    interface IConfig {
        configId: string;
        controlledMode: string;
        fanOns: FanOn[];
    }

    interface IMistingConfig {
        configId: string,
        controlledMode: string,
        mistingOns: [
            {
                intensity: string,
                tempThreshold: string,
                moistureThreshold: string
            },
        ]
    }

    interface IDoor {
        _id: string;
        deviceId: string;
        doorPassword: string;
        configId: string;
        createdAt: string;
        updatedAt: string;
        formattedCreatedAt?: string;
        formattedExpiration?: string;
    }

    interface lightOns {
        color: string;
        threshold: string;
    }

    interface mistingOns {
        intensity: string,
        tempThreshold: string,
        moistureThreshold: string
    }

}