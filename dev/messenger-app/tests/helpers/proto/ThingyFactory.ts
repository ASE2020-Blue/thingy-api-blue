import { ThingyLocalization } from '../../../src/proto/thingy_pb';

export class ThingyFactory {
    public static instance = new ThingyFactory();

    constructor() {
    }

    public createThingyLocalization(uuid: string, localization?: string): ThingyLocalization {
        const thingy = new ThingyLocalization();
        thingy.setThingyUuid(uuid);
        if (localization)
            thingy.setThingyUuid(localization);
        return thingy;
    }
}
