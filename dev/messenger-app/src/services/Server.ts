const grpc = require('grpc');
const services = require('../proto/messenger_grpc_pb');

// import { sendService } from './Send';

export const server = new grpc.Server();

server.addService(services.MessengerService, { sendTestMessage: (call, callback) => { console.log(12); } });
server.bind('0.0.0.0:5051', grpc.ServerCredentials.createInsecure());
