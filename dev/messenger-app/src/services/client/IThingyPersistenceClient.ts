import { ThingyLocation } from '../../proto/thingy_pb';

export interface IThingyPersistenceClient {
    getPendingLocation () : Promise<Array<ThingyLocation>>;
    setNewLocation (thingyLocation: ThingyLocation) : Promise<void>;
}
