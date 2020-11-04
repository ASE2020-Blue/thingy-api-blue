const grpc = require('@grpc/grpc-js');

const { PersistLocalizationService } = require('../../proto/thingy_grpc_pb');
const { ThingyServer } = require('./ThingyServer');

function createGRpcServer () {
    const server = new grpc.Server();

    const { BACKEND_GRPC_BIND_HOST, BACKEND_GRPC_BIND_PORT } = process.env;

    server.addService(PersistLocalizationService, new ThingyServer());

    server.bindAsync(
        `${BACKEND_GRPC_BIND_HOST}:${BACKEND_GRPC_BIND_PORT}`,
        grpc.ServerCredentials.createInsecure(),
        (error, port) => {
            if (error)
                throw error;

            server.start();
            console.log(`Started gRPC: ${BACKEND_GRPC_BIND_HOST}:${port}`);
        }
    )
}

module.exports = {
    createGRpcServer
}
