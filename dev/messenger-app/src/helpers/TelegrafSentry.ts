import * as Sentry from '@sentry/node';
import { ParseRequestOptions, RequestHandlerOptions } from '@sentry/node/dist/handlers';
import { Span } from '@sentry/tracing';
import { Event, Transaction } from '@sentry/types';
import * as domain from 'domain';
import * as os from 'os';
import { MiddlewareFn } from 'telegraf/typings/composer';
import { TelegrafContext } from 'telegraf/typings/context';

export function initSentry(): void {
    const { MESSENGER_SENTRY_DSN, DEBUG_SENTRY, ENABLE_SENTRY } = process.env;

    Sentry.init({
        dsn: MESSENGER_SENTRY_DSN,

        enabled: ENABLE_SENTRY === 'true' || ENABLE_SENTRY === '1',
        debug: DEBUG_SENTRY === 'true' || DEBUG_SENTRY === '1',

        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true })
        ],

        tracesSampleRate: 1.0
    });
}

/*
 * Base on the express handlers or koa's guide
 * @see https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts
 * @see https://docs.sentry.io/platforms/node/guides/koa/
 */

export function requestHandler<TContext extends TelegrafContext & SentryTransaction>(options?: RequestHandlerOptions): MiddlewareFn<TContext> {
    return async (ctx: TContext, next: () => Promise<void>): Promise<void> => {
        const local = domain.create();
        local.on('error', next);
        await local.run(async () => {
            Sentry.getCurrentHub().configureScope(scope =>
                scope.addEventProcessor((event: Event) => parseRequest(event, ctx, options))
            );
            await next();
        });
    };
}

export function tracingHandler<TContext extends TelegrafContext & SentryTransaction>(): MiddlewareFn<TContext> {
    return async (ctx: TContext, next: () => Promise<void>): Promise<void> => {
        debugger;
        const transaction = Sentry.startTransaction({
            // name: extractTransactionName(ctx),
            // --> name: eg. GET /mountpoint/user/:id
            // TODO improve to get watch we will handle
            name: 'handle message',
            op: 'telegram.messenger'
        });

        // We put the transaction on the scope so users can attach children to it
        Sentry.getCurrentHub().configureScope(scope => {
            scope.setSpan(transaction);
        });

        ctx.__sentry_transaction = transaction;

        await next();

        // Push `transaction.finish` to the next event loop so open spans have a chance to finish before the transaction
        // closes
        setImmediate(() => {
            // TODO look if it is necessary
            // addExpressReqToTransaction(transaction, req);
            // --> transaction.setData('url', req.originalUrl);
            // --> transaction.setData('baseUrl', req.baseUrl);
            // --> transaction.setData('query', req.query);
            transaction.finish();
        });
    }
}

export type ErrorHandler<TContext, R> = (error: Error, ctx: TContext) => R;

export function errorHandler<TContext extends TelegrafContext & SentryTransaction>(options?: {
    /**
     * Callback method deciding whether error should be captured and sent to Sentry
     * @param ctx Context in which the error was raised
     * @param error Captured middleware error
     */
    shouldHandleError?: ErrorHandler<TContext, boolean>
}): ErrorHandler<TContext, Promise<void>> {
    return async (error: Error, ctx: TContext): Promise<void> => {
        const shouldHandleError = (options && options.shouldHandleError) || (() => true);

        if (shouldHandleError(error, ctx)) {
            Sentry.withScope(scope => {
                // TODO not sure it is necessary
                //  present in koa guide
                // scope.addEventProcessor((event: Event) => parseRequest(event, ctx, otherOptions));

                // For some reason we need to set the transaction on the scope again
                const transaction = <Span>(ctx.__sentry_transaction);
                if (transaction && scope.getSpan() === undefined) {
                    scope.setSpan(transaction);
                }
                Sentry.captureException(error);
            });
        }
    };
}

/**
 * Enriches passed event with request data.
 *
 * @param event Will be mutated and enriched with req data
 * @param ctx context object
 * @param options object containing flags to enable functionality
 * @hidden
 */
export function parseRequest<TContext extends SentryTransaction>(event: Event, ctx: TContext, options?: ParseRequestOptions): Event {
    options = {
        ip: false,
        request: true,
        serverName: true,
        transaction: true,
        user: true,
        version: true,
        ...options,
    };

    if (options.version) {
        event.contexts = {
            ...event.contexts,
            runtime: {
                name: 'node',
                version: global.process.version,
            },
        };
    }

    if (options.request) {
        // FIXME
        // // if the option value is `true`, use the default set of keys by not passing anything to `extractNodeRequestData()`
        // const extractedRequestData = Array.isArray(options.request)
        //     ? extractNodeRequestData(req, options.request)
        //     : extractNodeRequestData(req);
        // event.request = {
        //     ...event.request,
        //     ...extractedRequestData,
        // };
    }

    if (options.serverName && !event.server_name) {
        event.server_name = global.process.env.SENTRY_NAME || os.hostname();
    }

    if (options.user) {
        // FIXME
        // const extractedUser = req.user && isPlainObject(req.user) ? extractUserData(req.user, options.user) : {};
        //
        // if (Object.keys(extractedUser)) {
        //     event.user = {
        //         ...event.user,
        //         ...extractedUser,
        //     };
        // }
    }

    if (options.transaction && !event.transaction) {
        event.transaction = ctx.__sentry_transaction.name
    }

    return event;
}

export declare interface SentryTransaction {
    __sentry_transaction: Transaction | undefined
}
