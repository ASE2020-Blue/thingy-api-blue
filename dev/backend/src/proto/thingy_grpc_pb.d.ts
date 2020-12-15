// package: 
// file: thingy.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";
import * as thingy_pb from "./thingy_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IThingyPersistenceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getPendingLocation: IThingyPersistenceService_IGetPendingLocation;
    setNewLocation: IThingyPersistenceService_ISetNewLocation;
    setNewValue: IThingyPersistenceService_ISetNewValue;
}

interface IThingyPersistenceService_IGetPendingLocation extends grpc.MethodDefinition<google_protobuf_empty_pb.Empty, thingy_pb.ThingyLocation> {
    path: "/ThingyPersistence/GetPendingLocation";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    requestDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
    responseSerialize: grpc.serialize<thingy_pb.ThingyLocation>;
    responseDeserialize: grpc.deserialize<thingy_pb.ThingyLocation>;
}
interface IThingyPersistenceService_ISetNewLocation extends grpc.MethodDefinition<thingy_pb.ThingyLocation, google_protobuf_empty_pb.Empty> {
    path: "/ThingyPersistence/SetNewLocation";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<thingy_pb.ThingyLocation>;
    requestDeserialize: grpc.deserialize<thingy_pb.ThingyLocation>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IThingyPersistenceService_ISetNewValue extends grpc.MethodDefinition<thingy_pb.ThingyValue, google_protobuf_empty_pb.Empty> {
    path: "/ThingyPersistence/SetNewValue";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<thingy_pb.ThingyValue>;
    requestDeserialize: grpc.deserialize<thingy_pb.ThingyValue>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const ThingyPersistenceService: IThingyPersistenceService;

export interface IThingyPersistenceServer {
    getPendingLocation: grpc.handleServerStreamingCall<google_protobuf_empty_pb.Empty, thingy_pb.ThingyLocation>;
    setNewLocation: grpc.handleUnaryCall<thingy_pb.ThingyLocation, google_protobuf_empty_pb.Empty>;
    setNewValue: grpc.handleUnaryCall<thingy_pb.ThingyValue, google_protobuf_empty_pb.Empty>;
}

export interface IThingyPersistenceClient {
    getPendingLocation(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<thingy_pb.ThingyLocation>;
    getPendingLocation(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<thingy_pb.ThingyLocation>;
    setNewLocation(request: thingy_pb.ThingyLocation, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewLocation(request: thingy_pb.ThingyLocation, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewLocation(request: thingy_pb.ThingyLocation, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewValue(request: thingy_pb.ThingyValue, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewValue(request: thingy_pb.ThingyValue, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    setNewValue(request: thingy_pb.ThingyValue, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class ThingyPersistenceClient extends grpc.Client implements IThingyPersistenceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getPendingLocation(request: google_protobuf_empty_pb.Empty, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<thingy_pb.ThingyLocation>;
    public getPendingLocation(request: google_protobuf_empty_pb.Empty, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<thingy_pb.ThingyLocation>;
    public setNewLocation(request: thingy_pb.ThingyLocation, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewLocation(request: thingy_pb.ThingyLocation, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewLocation(request: thingy_pb.ThingyLocation, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewValue(request: thingy_pb.ThingyValue, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewValue(request: thingy_pb.ThingyValue, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public setNewValue(request: thingy_pb.ThingyValue, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
