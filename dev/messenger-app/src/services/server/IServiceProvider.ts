import { ServiceDefinition, UntypedServiceImplementation } from '@grpc/grpc-js';

export interface IServiceProvider {

    getServiceDefinition(): ServiceDefinition;

    // https://github.com/microsoft/TypeScript/issues/15300
    // https://github.com/grpc/grpc-node/pull/1556 (attempt)
    // https://github.com/grpc/grpc-node/pull/1561
    // not possible to have index access inside a class
    getUntypedServiceImplementation(): UntypedServiceImplementation;
}
