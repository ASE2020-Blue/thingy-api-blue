import { Server, ServerCredentials } from '@grpc/grpc-js';
import { Telegram } from 'telegraf';

import { IServiceProvider } from './IServiceProvider';

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
            console.log(`Started gRPC: ${host}:${port}`);
        }
    );
}
