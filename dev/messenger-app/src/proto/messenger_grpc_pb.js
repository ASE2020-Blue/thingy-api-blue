// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var messenger_pb = require('./messenger_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_TestMessageRequest(arg) {
  if (!(arg instanceof messenger_pb.TestMessageRequest)) {
    throw new Error('Expected argument of type TestMessageRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_TestMessageRequest(buffer_arg) {
  return messenger_pb.TestMessageRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ThingyId(arg) {
  if (!(arg instanceof messenger_pb.ThingyId)) {
    throw new Error('Expected argument of type ThingyId');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ThingyId(buffer_arg) {
  return messenger_pb.ThingyId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


// *
// Services that the bot service provides to the rest of the infrastructure
//
// # Setting new location
// 1. Node-Red get button trigger (2 clicks)
// 2. Ask messenger to ask for location
// 3. Messenger, tells backend which location to store
var MessengerService = exports.MessengerService = {
  askNewLocation: {
    path: '/Messenger/AskNewLocation',
    requestStream: false,
    responseStream: false,
    requestType: messenger_pb.ThingyId,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_ThingyId,
    requestDeserialize: deserialize_ThingyId,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  sendTestMessage: {
    path: '/Messenger/SendTestMessage',
    requestStream: false,
    responseStream: false,
    requestType: messenger_pb.TestMessageRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_TestMessageRequest,
    requestDeserialize: deserialize_TestMessageRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.MessengerClient = grpc.makeGenericClientConstructor(MessengerService);
