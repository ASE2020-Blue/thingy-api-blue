import { credentials } from '@grpc/grpc-js';
import * as Debug from 'debug';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';

import { PersistLocalizationClient } from '../../proto/thingy_grpc_pb';
import { ThingyLocalization } from '../../proto/thingy_pb';
import { IPersistLocalizationClient } from './IPersistLocalizationClient';

const debug = Debug('messenger:grpc:client:PersistLocalizationClient');

export class GrpcPersistLocalizationClient implements IPersistLocalizationClient {

    private readonly grpcClient: PersistLocalizationClient;

    constructor(host: string, port: number) {
        this.grpcClient = new PersistLocalizationClient(
            `${host}:${port}`,
            credentials.createInsecure()
        );
    }

    public getPendingLocation(): Promise<Array<ThingyLocalization>> {
        return new Promise<Array<ThingyLocalization>>((resolve, reject) => {
            const thingies = new Array<ThingyLocalization>();
            const pendingLocationStream = this.grpcClient.getPendingLocation(new Empty());
            pendingLocationStream.on('data', (thingy: ThingyLocalization) => {
                thingies.push(thingy);
            });
            pendingLocationStream.on('end', () => {
                debug('Got pending thingies by grpc: %o', thingies);
                resolve(thingies);
            });
            pendingLocationStream.on('error', reject);
        });
    }

    public setNewLocation(thingyLocation: ThingyLocalization): Promise<void> {
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
