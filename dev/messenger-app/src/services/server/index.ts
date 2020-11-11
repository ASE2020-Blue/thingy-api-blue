const { MessengerService } = require('../../proto/messenger_grpc_pb');
import { Server, ServerCredentials } from '@grpc/grpc-js';
import { Telegram } from 'telegraf';

import { MessengerServer } from './MessengerServer';

const { MESS_GRPC_BIND_HOST, MESS_GRPC_BIND_PORT } = process.env;

export function createServer (telegram: Telegram) {
    const server = new Server();

    // https://github.com/microsoft/TypeScript/issues/15300
    // https://github.com/grpc/grpc-node/pull/1556 (attempt)
    // https://github.com/grpc/grpc-node/pull/1561
    // not possible to have index access inside a class
    // server.addService(MessengerService, new MessengerServer(telegram));

    // simplest solution found to the previously described problematic
    const { askNewLocation, sendTestMessage } = new MessengerServer(telegram);
    server.addService(MessengerService, { askNewLocation, sendTestMessage });

    server.bindAsync(
        `${MESS_GRPC_BIND_HOST}:${MESS_GRPC_BIND_PORT}`,
        ServerCredentials.createInsecure(),
        (error, port) => {
            if (error)
                throw error;

            server.start();
            console.log(`Started gRPC: ${MESS_GRPC_BIND_HOST}:${port}`);
        }
    );
}
