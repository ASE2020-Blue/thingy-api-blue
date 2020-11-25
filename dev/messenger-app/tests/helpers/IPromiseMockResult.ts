export interface IPromiseMockResult<D, R> {
    successfulResolve: boolean;
    resolveData: D;
    rejectReason: R;

    getPromise(): Promise<D>;
}
