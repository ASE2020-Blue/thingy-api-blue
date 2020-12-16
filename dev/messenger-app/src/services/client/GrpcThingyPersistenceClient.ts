import { credentials } from '@grpc/grpc-js';
import * as Debug from 'debug';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';

import { ThingyPersistenceClient } from '../../proto/thingy_grpc_pb';
import { ThingyLocation } from '../../proto/thingy_pb';
import { IThingyPersistenceClient } from './IThingyPersistenceClient';

const debug = Debug('messenger:grpc:client:ThingyPersistenceClient');

export class GrpcThingyPersistenceClient implements IThingyPersistenceClient {

    private readonly grpcClient: ThingyPersistenceClient;

    constructor(host: string, port: number) {
        // FIXME race promises to connect to service as the other service might not be up yet
        //  client.waitForReady(new Date().getTime()+ 2000, e => console.error(e)) waits for 2s
        this.grpcClient = new ThingyPersistenceClient(
            `${host}:${port}`,
            credentials.createInsecure()
        );
    }

    public getPendingLocation(): Promise<Array<ThingyLocation>> {
        return new Promise<Array<ThingyLocation>>((resolve, reject) => {
            const thingies = new Array<ThingyLocation>();
            const pendingLocationStream = this.grpcClient.getPendingLocation(new Empty());
            pendingLocationStream.on('data', (thingy: ThingyLocation) => {
                thingies.push(thingy);
            });
            pendingLocationStream.on('end', () => {
                debug('Got pending thingies by grpc: %o', thingies);
                resolve(thingies);
            });
            pendingLocationStream.on('error', reject);
        });
    }

    public setNewLocation(thingyLocation: ThingyLocation): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.grpcClient.setNewLocation(thingyLocation, (error) => {
                if (error) {
                    reject(error);
                } else {
                    debug('Successfully persisted location through grpc');
                    resolve();
                }
            });
        });
    }
}
