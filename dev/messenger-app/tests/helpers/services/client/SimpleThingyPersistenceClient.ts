import { ThingyLocation } from '../../../../src/proto/thingy_pb';
import { IThingyPersistenceClient } from '../../../../src/services/client/IThingyPersistenceClient';
import { IPromiseMockResult } from '../../IPromiseMockResult';

export class SimpleThingyPersistenceClient implements IThingyPersistenceClient {
    private pendingLocationResult: IPromiseMockResult<Array<ThingyLocation>, any>;
    private persistLocationResult: IPromiseMockResult<void, any>;

    constructor(pendingLocationResult: IPromiseMockResult<Array<ThingyLocation>, any>, persistLocationResult: IPromiseMockResult<void, any>) {
        this.pendingLocationResult = pendingLocationResult;
        this.persistLocationResult = persistLocationResult;
    }

    public getPendingLocationResult(): IPromiseMockResult<Array<ThingyLocation>, any> {
        return this.pendingLocationResult;
    }

    public setPendingLocationResult(value: IPromiseMockResult<Array<ThingyLocation>, any>) {
        this.pendingLocationResult = value;
    }

    public getPersistLocationResult(): IPromiseMockResult<void, any> {
        return this.persistLocationResult;
    }

    public setPersistLocationResult(value: IPromiseMockResult<void, any>) {
        this.persistLocationResult = value;
    }

    public getPendingLocation(): Promise<Array<ThingyLocation>> {
        return this.pendingLocationResult.getPromise();
    }

    public setNewLocation(thingyLocation: ThingyLocation): Promise<void> {
        return this.persistLocationResult.getPromise();
    }

}
