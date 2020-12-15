require("../controllers/sentry").initSentryInProd();

const Koa = require('koa');
const router = require('koa-router')();
const session = require("koa-session");
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const cors = require('@koa/cors');

// Initialize passport strategies
require("../controllers/authentication");

const { addSentryMiddlewareInProd } = require("../controllers/sentry");
const authenticate = require("../routes/authenticate");
const thingies = require("../routes/thingies");
const historyLocations = require("../routes/locationHistories");
const environmentParamsValues = require("../routes/environmentParamsValues");

const app = new Koa();
addSentryMiddlewareInProd(app);

/**
 * Signed cookie keys.
 * Generated with `openssl rand -base64 16`
 */
app.keys = ['BUJA1COk/BE+cfZQ0J1Fcw=='];

// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

function verifyOrigin(ctx) {
    // Get requesting origin hostname
    let origin = ctx.headers.origin;

    // List of valid origins
    let validOrigins = ['http://localhost:8080', 'http://localhost', 'http://51.15.209.246'];

    // Make sure it's a valid origin
    if (validOrigins.indexOf(origin) !== -1 && process.env.NODE_ENV === "production") {
        // Set the header to the requested origin
        ctx.set('Access-Control-Allow-Origin', origin);
        return origin;
    }
}


const options = {
    credentials: true,
    origin: verifyOrigin
};

/*if (process.env.NODE_ENV === "production")
  options.origin = process.env.APP_BASE_URL;*/

app
    // make koa support and handle sessions/cookies
    .use(session(app))
    .use(bodyParser())
    .use(cors(options))
    .use(router.routes())
    .use(router.allowedMethods())
    // initialize in the ctx the different helper function of passport
    // like: `logIn`, `logOut`, `isAuthenticated()` etc.
    // see passport's doc and the koa-passport doc (source is more informative)
    .use(passport.initialize({}))
    // middleware to restore a user from the session/cookie, if any
    .use(passport.session({}))
    .use(authenticate.routes())
    .use(thingies.routes())
    .use(historyLocations.routes())
    .use(environmentParamsValues.routes());

module.exports = app;
