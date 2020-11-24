import { TelegrafContext } from 'telegraf/typings/context';

/**
 * Hack, as the local session middleware of telegraf will not pass through the value carried through the execution,
 * but will override it with the result of the map.set function.
 *
 * @param opts
 */
export function session<TContext extends TelegrafContext>(opts?: {
    property?: string
    store?: Map<string, any>
    getSessionKey?: (ctx: TContext) => string
ttl?: number
}) { // Not typed return, as it will break with the bad middleware declaration without passing ctx to next function
    const options = {
        property: 'session',
        store: new Map(),
        getSessionKey: (ctx) => ctx.from && ctx.chat && `${ctx.from.id}:${ctx.chat.id}`,
        ...opts
    }

    const ttlMs = options.ttl && options.ttl * 1000

    return (ctx, next) => {
        const key = options.getSessionKey(ctx)
        if (!key) {
            return next(ctx)
        }
        const now = Date.now()
        return Promise.resolve(options.store.get(key))
            .then((state) => state || { session: {} })
            .then(({ session, expires }) => {
                if (expires && expires < now) {
                    session = {}
                }
                Object.defineProperty(ctx, options.property, {
                    get: () => session,
                    set: newValue => { session = { ...newValue } }
                })
                return next(ctx)
                    .then((d) => {
                        options.store.set(key, {
                            session,
                            expires: ttlMs ? now + ttlMs : null
                        });
                        return d;
                    })
            })
    }
}
