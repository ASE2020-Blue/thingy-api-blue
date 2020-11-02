// package: 
// file: messenger.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class TestMessageRequest extends jspb.Message { 
    getText(): string;
    setText(value: string): TestMessageRequest;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TestMessageRequest.AsObject;
    static toObject(includeInstance: boolean, msg: TestMessageRequest): TestMessageRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TestMessageRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TestMessageRequest;
    static deserializeBinaryFromReader(message: TestMessageRequest, reader: jspb.BinaryReader): TestMessageRequest;
}

export namespace TestMessageRequest {
    export type AsObject = {
        text: string,
    }
}

export enum MessageType {
    PLAIN = 0,
    MARKDOWN = 1,
}
