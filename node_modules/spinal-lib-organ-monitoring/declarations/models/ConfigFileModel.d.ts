import { Lst, Model, Str, Val, Ptr } from "spinal-core-connectorjs";
interface ILog extends Model {
    timeStamp: Val;
    message: Str;
}
interface IGenericOrganData extends Model {
    name: Str;
    bootTimestamp: Val;
    lastHealthTime: Val;
    ramHeapUsed: Str;
    logList: Lst<ILog>;
}
interface ISpecificOrganData extends Model {
    state: Str;
    ipAdress: Str;
    port: Val;
    protocol: Str;
    lastAction: {
        message: Str;
        date: Val;
    };
}
export declare class ConfigFileModel extends Model {
    genericOrganData: IGenericOrganData;
    specificOrganData: ISpecificOrganData;
    specificOrganConfig?: Ptr<any>;
    constructor(name: string, ipAdress?: string, port?: number, protocol?: string);
    addToConfigFileModel(): Lst;
    updateRamUsage(): void;
    loadConfigModel(): Promise<any> | undefined;
    setConfigModel(model: Model): void;
}
export {};
