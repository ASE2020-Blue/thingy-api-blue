import { ThingyLocalization } from '../../proto/thingy_pb';

export interface IPersistLocalizationClient {
    setNewLocation (thingyLocation: ThingyLocalization) : Promise<void>;
    getPendingLocation () : Promise<Array<ThingyLocalization>>;
}
