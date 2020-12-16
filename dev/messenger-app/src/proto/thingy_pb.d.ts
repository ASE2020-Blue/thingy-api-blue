// package: 
// file: thingy.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class ThingyLocation extends jspb.Message { 
    getThingyUuid(): string;
    setThingyUuid(value: string): ThingyLocation;

    getLocation(): string;
    setLocation(value: string): ThingyLocation;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ThingyLocation.AsObject;
    static toObject(includeInstance: boolean, msg: ThingyLocation): ThingyLocation.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ThingyLocation, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ThingyLocation;
    static deserializeBinaryFromReader(message: ThingyLocation, reader: jspb.BinaryReader): ThingyLocation;
}

export namespace ThingyLocation {
    export type AsObject = {
        thingyUuid: string,
        location: string,
    }
}

export class ThingyValue extends jspb.Message { 
    getThingyUuid(): string;
    setThingyUuid(value: string): ThingyValue;

    getValue(): number;
    setValue(value: number): ThingyValue;

    getEnvParam(): ThingyValue.EnvParam;
    setEnvParam(value: ThingyValue.EnvParam): ThingyValue;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ThingyValue.AsObject;
    static toObject(includeInstance: boolean, msg: ThingyValue): ThingyValue.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ThingyValue, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ThingyValue;
    static deserializeBinaryFromReader(message: ThingyValue, reader: jspb.BinaryReader): ThingyValue;
}

export namespace ThingyValue {
    export type AsObject = {
        thingyUuid: string,
        value: number,
        envParam: ThingyValue.EnvParam,
    }

    export enum EnvParam {
    TEMPERATURE = 0,
    HUMIDITY = 1,
    AIR_QUALITY = 2,
    AIR_PRESSURE = 3,
    CO2_EQUIV = 4,
    LIGHT = 5,
    }

}
