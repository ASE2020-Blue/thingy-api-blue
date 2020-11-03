const grpc = require('@grpc/grpc-js');
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { PersistLocalizationClient } from '../../@types/proto/thingy_localization_grpc_pb';
import { ThingyLocalization } from '../../@types/proto/thingy_localization_pb';

const { BACKEND_GRPC_BIND_PORT } = process.env;

const persistLocalizationClient = new PersistLocalizationClient(
    `backend:${BACKEND_GRPC_BIND_PORT}`,
    grpc.credentials.createInsecure()
);

export function setNewLocation (thingyLocation: ThingyLocalization) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
        persistLocalizationClient.setNewLocation(thingyLocation, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export function getPendingLocation () : Promise<Array<ThingyLocalization>> {
    return new Promise<Array<ThingyLocalization>>((resolve, reject) => {
        const thingies = new Array<ThingyLocalization>();
        const pendingLocationStream = persistLocalizationClient.getPendingLocation(new Empty());
        pendingLocationStream.on('data', (thingy: ThingyLocalization) => {
            thingies.push(thingy);
        });
        pendingLocationStream.on('end', () => {
            resolve(thingies);
        });
        pendingLocationStream.on('error', reject);
    });
}
