// package:
// file: thingy.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as thingy_pb from "./thingy_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IPersistLocalizationService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getPendingLocation: IPersistLocalizationService_IGetPendingLocation;
    setNewLocation: IPersistLocalizationService_ISetNewLocation;
}

interface IPersistLocalizationService_IGetPendingLocation extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, thingy_pb.ThingyLocalization> {
    path: "/PersistLocalization/GetPendingLocation";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<thingy_pb.ThingyLocalization>;
    responseDeserialize: grpc.deserialize<thingy_pb.ThingyLocalization>;
}
interface IPersistLocalizationService_ISetNewLocation extends grpc.MethodDefinition<thingy_pb.ThingyLocalization, google_protobuf_empty_pb.Empty> {
    path: "/PersistLocalization/SetNewLocation";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<thingy_pb.ThingyLocalization>;
    requestDeserialize: grpc.deserialize<thingy_pb.ThingyLocalization>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const PersistLocalizationService: IPersistLocalizationService;

export interface IPersistLocalizationServer {
    getPendingLocation: grpc.handleServerStreamingCall<google_protobuf_empty_pb.Empty, thingy_pb.ThingyLocalization>;
    setNewLocation: grpc.handleUnaryCall<thingy_pb.ThingyLocalization, google_protobuf_empty_pb.Empty>;
}

export interface IPersistLocalizationClient {
    getPendingLocation(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<thingy_pb.ThingyLocalization>;
    getPendingLocation(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<thingy_pb.ThingyLocalization>;
    setNewLocation(request: thingy_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewLocation(request: thingy_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewLocation(request: thingy_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class PersistLocalizationClient extends grpc.Client implements IPersistLocalizationClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getPendingLocation(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<thingy_pb.ThingyLocalization>;
    public getPendingLocation(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<thingy_pb.ThingyLocalization>;
    public setNewLocation(request: thingy_pb.ThingyLocalization, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewLocation(request: thingy_pb.ThingyLocalization, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewLocation(request: thingy_pb.ThingyLocalization, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
