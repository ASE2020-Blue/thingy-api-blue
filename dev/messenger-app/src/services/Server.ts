import {IMessengerServer} from "../@types/proto/messenger_grpc_pb";

const grpc = require('grpc');
const { MessengerService } = require('../proto/messenger_grpc_pb');

import { MessengerServer } from './Send';

export const server = new grpc.Server();

server.addService(MessengerService, new MessengerServer());
