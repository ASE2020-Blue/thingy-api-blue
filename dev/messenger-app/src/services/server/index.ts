const grpc = require('@grpc/grpc-js');
const { MessengerService } = require('../../proto/messenger_grpc_pb');
import {Telegram} from 'telegraf';

import { MessengerServer } from './MessengerServer';

const { GRPC_BIND_HOST, GRPC_BIND_PORT } = process.env;

export function createServer (telegram: Telegram) {
    const server = new grpc.Server();

    server.addService(MessengerService, new MessengerServer(telegram));

    console.log(`Starting gRPC: ${GRPC_BIND_HOST}:${GRPC_BIND_PORT}`);
    server.bind(`${GRPC_BIND_HOST}:${GRPC_BIND_PORT}`, grpc.ServerCredentials.createInsecure());
    server.start();
}
