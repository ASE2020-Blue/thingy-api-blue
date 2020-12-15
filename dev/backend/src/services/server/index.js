const grpc = require('@grpc/grpc-js');

const { PersistLocalizationService } = require('../../proto/thingy_grpc_pb');
const { ThingyServer } = require('./ThingyServer');

function createGRpcServer() {
    const server = new grpc.Server();

    const { BACKEND_GRPC_BIND_HOST, BACKEND_GRPC_BIND_PORT } = process.env;

    server.addService(PersistLocalizationService, new ThingyServer());

    return new Promise((resolve, reject) => {
        server.bindAsync(
            `${BACKEND_GRPC_BIND_HOST}:${BACKEND_GRPC_BIND_PORT}`,
            grpc.ServerCredentials.createInsecure(),
            (error, port) => {
                if (error)
                    reject(error);

                server.start();
                console.log(`Started gRPC: ${BACKEND_GRPC_BIND_HOST}:${port}`);
                resolve(server);
            }
        );
    });
}

module.exports = {
    createGRpcServer
}
