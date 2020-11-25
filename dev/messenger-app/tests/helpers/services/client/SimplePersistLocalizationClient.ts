import { ThingyLocalization } from '../../../../src/proto/thingy_pb';
import { IPersistLocalizationClient } from '../../../../src/services/client/IPersistLocalizationClient';
import { IPromiseMockResult } from '../../IPromiseMockResult';

export class SimplePersistLocalizationClient implements IPersistLocalizationClient {
    private pendingLocationResult: IPromiseMockResult<Array<ThingyLocalization>, any>;
    private persistLocationResult: IPromiseMockResult<void, any>;

    constructor(pendingLocationResult: IPromiseMockResult<Array<ThingyLocalization>, any>, persistLocationResult: IPromiseMockResult<void, any>) {
        this.pendingLocationResult = pendingLocationResult;
        this.persistLocationResult = persistLocationResult;
    }

    public getPendingLocationResult(): IPromiseMockResult<Array<ThingyLocalization>, any> {
        return this.pendingLocationResult;
    }

    public setPendingLocationResult(value: IPromiseMockResult<Array<ThingyLocalization>, any>) {
        this.pendingLocationResult = value;
    }

    public getPersistLocationResult(): IPromiseMockResult<void, any> {
        return this.persistLocationResult;
    }

    public setPersistLocationResult(value: IPromiseMockResult<void, any>) {
        this.persistLocationResult = value;
    }

    public getPendingLocation(): Promise<Array<ThingyLocalization>> {
        return this.pendingLocationResult.getPromise();
    }

    public setNewLocation(thingyLocation: ThingyLocalization): Promise<void> {
        return this.persistLocationResult.getPromise();
    }

}
