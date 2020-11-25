import { ThingyLocalization } from '../../proto/thingy_pb';

export interface IPersistLocalizationClient {
    getPendingLocation () : Promise<Array<ThingyLocalization>>;
    setNewLocation (thingyLocation: ThingyLocalization) : Promise<void>;
}
