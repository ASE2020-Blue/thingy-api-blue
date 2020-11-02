// package: 
// file: messenger.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import {handleClientStreamingCall} from "@grpc/grpc-js/build/src/server-call";
import * as messenger_pb from "./messenger_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IMessengerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sendTestMessage: IMessengerService_ISendTestMessage;
}

interface IMessengerService_ISendTestMessage extends grpc.MethodDefinition<messenger_pb.TestMessageRequest, google_protobuf_empty_pb.Empty> {
    path: "/Messenger/SendTestMessage";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<messenger_pb.TestMessageRequest>;
    requestDeserialize: grpc.deserialize<messenger_pb.TestMessageRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const MessengerService: IMessengerService;

export interface IMessengerServer {
    sendTestMessage: grpc.handleUnaryCall<messenger_pb.TestMessageRequest, google_protobuf_empty_pb.Empty>;
}

export interface IMessengerClient {
    sendTestMessage(request: messenger_pb.TestMessageRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    sendTestMessage(request: messenger_pb.TestMessageRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    sendTestMessage(request: messenger_pb.TestMessageRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class MessengerClient extends grpc.Client implements IMessengerClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public sendTestMessage(request: messenger_pb.TestMessageRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public sendTestMessage(request: messenger_pb.TestMessageRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public sendTestMessage(request: messenger_pb.TestMessageRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
