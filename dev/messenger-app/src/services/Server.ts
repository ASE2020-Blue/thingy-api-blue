const grpc = require('@grpc/grpc-js');
const { MessengerService } = require('../proto/messenger_grpc_pb');
import {Telegram} from 'telegraf';

import { MessengerServer } from './Send';

const { GRPC_BIND_HOST, GRPC_BIND_POST } = process.env;

export function createServer (telegram: Telegram) {
    const server = new grpc.Server();

    server.addService(MessengerService, new MessengerServer(telegram));

    console.log(`Starting gRPC: ${GRPC_BIND_HOST}:${GRPC_BIND_POST}`);
    server.bind(`${GRPC_BIND_HOST}:${GRPC_BIND_POST}`, grpc.ServerCredentials.createInsecure());
    server.start();
}
