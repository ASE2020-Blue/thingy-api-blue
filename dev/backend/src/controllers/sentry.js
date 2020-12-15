const Sentry = require("@sentry/node");
const {
    extractTraceparentData,
    stripUrlQueryAndFragment,
} = require("@sentry/tracing");
const domain = require("domain");

/*
 * Revamped source: https://docs.sentry.io/platforms/node/guides/koa/
 */

module.exports.initSentryInProd = function initSentryInProd() {
    const { NODE_ENV, BACKEND_SENTRY_DSN, ENABLE_SENTRY, DEBUG_SENTRY } = process.env;

    if (NODE_ENV !== 'production')
        return;

    Sentry.init({
        dsn: BACKEND_SENTRY_DSN,

        enabled: ENABLE_SENTRY === 'true' || ENABLE_SENTRY === '1',
        debug: DEBUG_SENTRY === 'true' || DEBUG_SENTRY === '1',

        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true })
        ],

        tracesSampleRate: 1.0
    });
}

module.exports.addSentryMiddlewareInProd = function addSentryMiddlewareInProd(app) {
    const { NODE_ENV } = process.env;

    if (NODE_ENV !== 'production')
        return;

    app.use(requestHandler());
    app.use(tracingHandler());

    app.on('error', errorHandler());
}

function requestHandler() {
    return (ctx, next) => {
        return new Promise((resolve, _) => {
            const local = domain.create();
            local.add(ctx);
            local.on("error", err => {
                ctx.status = err.status || 500;
                ctx.body = err.message;
                ctx.app.emit("error", err, ctx);
            });
            return local.run(async () => {
                Sentry.getCurrentHub().configureScope(scope =>
                    scope.addEventProcessor(event =>
                        Sentry.Handlers.parseRequest(event, ctx.request, { user: false })
                    )
                );
                await next();
                resolve();
            });
        });
    }
}

// this tracing middleware creates a transaction per request
function tracingHandler() {
    return async (ctx, next) => {
        const reqMethod = (ctx.method || "").toUpperCase();
        const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

        // connect to trace of upstream app
        let traceparentData;
        if (ctx.request.get("sentry-trace")) {
            traceparentData = extractTraceparentData(ctx.request.get("sentry-trace"));
        }

        const transaction = Sentry.startTransaction({
            name: `${reqMethod} ${reqUrl}`,
            op: "http.server",
            ...traceparentData,
        });

        ctx.__sentry_transaction = transaction;
        await next();

        // if using koa router, a nicer way to capture transaction using the matched route
        if (ctx._matchedRoute) {
            const mountPath = ctx.mountPath || "";
            transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`);
        }
        transaction.setHttpStatus(ctx.status);
        transaction.finish();
    };
}

function errorHandler() {
    return (err, ctx) => {
        Sentry.withScope(scope => {
            scope.addEventProcessor(event => {
                return Sentry.Handlers.parseRequest(event, ctx.request);
            });
            Sentry.captureException(err);
        });
    };
}

module.exports.requestHandler = requestHandler
module.exports.tracingMiddleware = tracingHandler
module.exports.errorHandler = errorHandler
