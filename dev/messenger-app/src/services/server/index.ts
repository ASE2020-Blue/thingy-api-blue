import { Server, ServerCredentials } from '@grpc/grpc-js';
import * as Debug from 'debug';

import { IServiceProvider } from './IServiceProvider';

const debug = Debug('messenger:grpc:server');

export function createServer (host: string, port: number, serviceProviders: Array<IServiceProvider>) {
    const server = new Server();

    for (const serviceProvider of serviceProviders) {
        server.addService(serviceProvider.getServiceDefinition(), serviceProvider.getUntypedServiceImplementation());
    }

    server.bindAsync(
        `${host}:${port}`,
        ServerCredentials.createInsecure(),
        (error, port) => {
            if (error)
                throw error;

            server.start();
            debug(`Started gRPC: ${host}:${port}`);
        }
    );
}
