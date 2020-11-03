// package: 
// file: thingy_localization.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";
import * as thingy_localization_pb from "./thingy_localization_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IDemandLocalizationService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    askNewLocation: IDemandLocalizationService_IAskNewLocation;
}

interface IDemandLocalizationService_IAskNewLocation extends grpc.MethodDefinition<thingy_localization_pb.ThingyLocalization, google_protobuf_empty_pb.Empty> {
    path: "/DemandLocalization/AskNewLocation";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<thingy_localization_pb.ThingyLocalization>;
    requestDeserialize: grpc.deserialize<thingy_localization_pb.ThingyLocalization>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const DemandLocalizationService: IDemandLocalizationService;

export interface IDemandLocalizationServer {
    askNewLocation: grpc.handleUnaryCall<thingy_localization_pb.ThingyLocalization, google_protobuf_empty_pb.Empty>;
}

export interface IDemandLocalizationClient {
    askNewLocation(request: thingy_localization_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    askNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    askNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class DemandLocalizationClient extends grpc.Client implements IDemandLocalizationClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public askNewLocation(request: thingy_localization_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public askNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public askNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

interface IPersistLocalizationService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    setNewLocation: IPersistLocalizationService_ISetNewLocation;
}

interface IPersistLocalizationService_ISetNewLocation extends grpc.MethodDefinition<thingy_localization_pb.ThingyLocalization, google_protobuf_empty_pb.Empty> {
    path: "/PersistLocalization/SetNewLocation";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<thingy_localization_pb.ThingyLocalization>;
    requestDeserialize: grpc.deserialize<thingy_localization_pb.ThingyLocalization>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const PersistLocalizationService: IPersistLocalizationService;

export interface IPersistLocalizationServer {
    setNewLocation: grpc.handleUnaryCall<thingy_localization_pb.ThingyLocalization, google_protobuf_empty_pb.Empty>;
}

export interface IPersistLocalizationClient {
    setNewLocation(request: thingy_localization_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class PersistLocalizationClient extends grpc.Client implements IPersistLocalizationClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public setNewLocation(request: thingy_localization_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
