import { ThingyLocation } from '../../../src/proto/thingy_pb';

export class ThingyFactory {
    public static instance = new ThingyFactory();

    constructor() {
    }

    public createThingyLocation (uuid: string, localization?: string): ThingyLocation {
        const thingy = new ThingyLocation();
        thingy.setThingyUuid(uuid);
        if (localization)
            thingy.setThingyUuid(localization);
        return thingy;
    }
}
