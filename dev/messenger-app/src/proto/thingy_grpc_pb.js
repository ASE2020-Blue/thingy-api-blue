// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var thingy_pb = require('./thingy_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_ThingyLocalization(arg) {
  if (!(arg instanceof thingy_pb.ThingyLocalization)) {
    throw new Error('Expected argument of type ThingyLocalization');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_ThingyLocalization(buffer_arg) {
  return thingy_pb.ThingyLocalization.deserializeBinary(new Uint8Array(buffer_arg));
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
var PersistLocalizationService = exports.PersistLocalizationService = {
  getPendingLocation: {
    path: '/PersistLocalization/GetPendingLocation',
    requestStream: false,
    responseStream: true,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: thingy_pb.ThingyLocalization,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_ThingyLocalization,
    responseDeserialize: deserialize_ThingyLocalization,
  },
  setNewLocation: {
    path: '/PersistLocalization/SetNewLocation',
    requestStream: false,
    responseStream: false,
    requestType: thingy_pb.ThingyLocalization,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_ThingyLocalization,
    requestDeserialize: deserialize_ThingyLocalization,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.PersistLocalizationClient = grpc.makeGenericClientConstructor(PersistLocalizationService);
