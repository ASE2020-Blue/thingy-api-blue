// package: 
// file: thingy_localization.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class ThingyLocalization extends jspb.Message { 
    getThingyUuid(): string;
    setThingyUuid(value: string): ThingyLocalization;

    getLocation(): string;
    setLocation(value: string): ThingyLocalization;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ThingyLocalization.AsObject;
    static toObject(includeInstance: boolean, msg: ThingyLocalization): ThingyLocalization.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ThingyLocalization, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ThingyLocalization;
    static deserializeBinaryFromReader(message: ThingyLocalization, reader: jspb.BinaryReader): ThingyLocalization;
}

export namespace ThingyLocalization {
    export type AsObject = {
        thingyUuid: string,
        location: string,
    }
}
