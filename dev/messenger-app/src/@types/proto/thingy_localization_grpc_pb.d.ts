// package:
// file: thingy_localization.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as thingy_localization_pb from "./thingy_localization_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface ILocalizationService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    askNewLocation: ILocalizationService_IAskNewLocation;
    setNewLocation: ILocalizationService_ISetNewLocation;
}

interface ILocalizationService_IAskNewLocation extends grpc.MethodDefinition<thingy_localization_pb.ThingyLocalization, google_protobuf_empty_pb.Empty> {
    path: "/Localization/AskNewLocation";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<thingy_localization_pb.ThingyLocalization>;
    requestDeserialize: grpc.deserialize<thingy_localization_pb.ThingyLocalization>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface ILocalizationService_ISetNewLocation extends grpc.MethodDefinition<thingy_localization_pb.ThingyLocalization, google_protobuf_empty_pb.Empty> {
    path: "/Localization/SetNewLocation";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<thingy_localization_pb.ThingyLocalization>;
    requestDeserialize: grpc.deserialize<thingy_localization_pb.ThingyLocalization>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const LocalizationService: ILocalizationService;

export interface ILocalizationServer {
    askNewLocation: grpc.handleUnaryCall<thingy_localization_pb.ThingyLocalization, google_protobuf_empty_pb.Empty>;
    setNewLocation: grpc.handleUnaryCall<thingy_localization_pb.ThingyLocalization, google_protobuf_empty_pb.Empty>;
}

export interface ILocalizationClient {
    askNewLocation(request: thingy_localization_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    askNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    askNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewLocation(request: thingy_localization_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class LocalizationClient extends grpc.Client implements ILocalizationClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public askNewLocation(request: thingy_localization_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public askNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public askNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewLocation(request: thingy_localization_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewLocation(request: thingy_localization_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
