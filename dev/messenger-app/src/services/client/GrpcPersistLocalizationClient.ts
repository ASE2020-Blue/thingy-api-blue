const grpc = require('@grpc/grpc-js');
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { PersistLocalizationClient } from '../../proto/thingy_grpc_pb';
import { ThingyLocalization } from '../../proto/thingy_pb';
import { IPersistLocalizationClient } from './IPersistLocalizationClient';

export class GrpcPersistLocalizationClient implements IPersistLocalizationClient {

    private readonly grpcClient: PersistLocalizationClient;

    constructor(host: string, port: number) {
        this.grpcClient = new PersistLocalizationClient(
            `${host}:${port}`,
            grpc.credentials.createInsecure()
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
                console.log('Got pending thingies by grpc:', thingies);
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
                    console.log('Successfully persisted location through grpc');
                    resolve();
                }
            });
        });
    }
}
