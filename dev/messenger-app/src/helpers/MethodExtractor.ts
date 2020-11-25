export function extractAndBind <T, R>(obj: T, methodNames: Array<keyof T>): Array<R> {
    return methodNames
        .map(methodName => {
            const fn = obj[methodName];

            return typeof fn === 'function' ? fn : undefined;
        })
        .filter(fn => !! fn)
        .map((fn: Function) => fn.bind(obj));
}
