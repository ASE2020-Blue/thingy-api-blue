// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var thingy_pb = require('./thingy_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_ThingyLocation(arg) {
  if (!(arg instanceof thingy_pb.ThingyLocation)) {
    throw new Error('Expected argument of type ThingyLocation');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ThingyLocation(buffer_arg) {
  return thingy_pb.ThingyLocation.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_ThingyValue(arg) {
  if (!(arg instanceof thingy_pb.ThingyValue)) {
    throw new Error('Expected argument of type ThingyValue');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ThingyValue(buffer_arg) {
  return thingy_pb.ThingyValue.deserializeBinary(new Uint8Array(buffer_arg));
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
// # New user start conversation with bot
// 1. Messenger asks the backed for missing location
// 2. If some thingy are missing locations, return to the messenger the uuids
// 3. Like 'new location' scenario (of messenger), starting from point 2
//
// *
// Implemented by the backend
var ThingyPersistenceService = exports.ThingyPersistenceService = {
  getPendingLocation: {
    path: '/ThingyPersistence/GetPendingLocation',
    requestStream: false,
    responseStream: true,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: thingy_pb.ThingyLocation,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_ThingyLocation,
    responseDeserialize: deserialize_ThingyLocation,
  },
  setNewLocation: {
    path: '/ThingyPersistence/SetNewLocation',
    requestStream: false,
    responseStream: false,
    requestType: thingy_pb.ThingyLocation,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_ThingyLocation,
    requestDeserialize: deserialize_ThingyLocation,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  setNewValue: {
    path: '/ThingyPersistence/SetNewValue',
    requestStream: false,
    responseStream: false,
    requestType: thingy_pb.ThingyValue,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_ThingyValue,
    requestDeserialize: deserialize_ThingyValue,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.ThingyPersistenceClient = grpc.makeGenericClientConstructor(ThingyPersistenceService);
