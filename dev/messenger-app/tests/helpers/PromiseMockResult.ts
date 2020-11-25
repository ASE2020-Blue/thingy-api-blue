import { IPromiseMockResult } from './IPromiseMockResult';

export class PromiseMockResult<D, R> implements IPromiseMockResult<D, R> {
    public successfulResolve: boolean;

    public resolveData: D;

    public rejectReason: R;

    constructor(successfulResolve: boolean, resolveData: D = undefined, rejectReason: R = undefined) {
        this.successfulResolve = successfulResolve;
        this.resolveData = resolveData;
        this.rejectReason = rejectReason;
    }

    public getPromise(): Promise<D> {

        if (this.successfulResolve)
            return Promise.resolve(this.resolveData);
        else
            return Promise.reject(this.rejectReason);
    }
}

export const successResult = <D>(data: D): PromiseMockResult<D, any> => new PromiseMockResult<D, any>(true, data);
export const errorResult = <R>(reason?: R): PromiseMockResult<any, R> => new PromiseMockResult<any, R>(false, undefined, reason);
