export interface IStationEquipment {
    kks: string | null;
    sys: string;
    samples: string[];
}
export interface IStationEquipmentExtended {
    title: string;
    kks: string | null;
    sys: string;
    samples: string[];
}

export interface IStationCommonParameters {
    [key: string]: IStationEquipment;
}

export interface IStationBalance {
    [key: string]: string;
}

export interface IStationSchema {
    id: number;
    code: string;
    title: string;
    subSchemas?: IStationSchema[];
};

export interface IStationDashboard {
    commonParameters: IStationCommonParameters;
    balance: IStationBalance;
    mainEquipments: IStationEquipmentExtended[];
    mainSchema: IStationSchema;
}

export interface IStationCategory {
    id: number;
    code: string;
    title: string;
    schemas: IStationSchema[];
}

export interface IStation {
    id: number;
    code: string;
    title: string;
    dashboard: IStationDashboard;
    categories: IStationCategory[];
}

export interface IBranch {
    id: number;
    code: string;
    title: string;
    stations: IStation[];
}

export interface IBranches {
    branches: IBranch[]
}
