const grpc = require('@grpc/grpc-js');
const { MessengerService } = require('../../proto/messenger_grpc_pb');
import { Telegram } from 'telegraf';

import { MessengerServer } from './MessengerServer';

const { MESS_GRPC_BIND_HOST, MESS_GRPC_BIND_PORT } = process.env;

export function createServer (telegram: Telegram) {
    const server = new grpc.Server();

    server.addService(MessengerService, new MessengerServer(telegram));

    server.bindAsync(
        `${MESS_GRPC_BIND_HOST}:${MESS_GRPC_BIND_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            if (error) {
                console.log(`Started gRPC: ${MESS_GRPC_BIND_HOST}:${port}`);
                throw error;
            }
            server.start();
        }
    );
}
