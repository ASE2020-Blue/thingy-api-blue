const Koa = require('koa');
const router = require('koa-router')();
const session = require("koa-session");
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');
const cors = require('@koa/cors');

// Initialize passport strategies
require("../controllers/authentication");

const authenticate = require("../routes/authenticate");
const thingies = require("../routes/thingies");
const historyLocations = require("../routes/locationHistories");
const environmentParamsValues = require("../routes/environmentParamsValues");

const app = new Koa();
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

app
    .use(session(app))
    .use(bodyParser())
    .use(cors({
        credentials: true
    }))
    .use(router.routes())
    .use(router.allowedMethods())
    .use(passport.initialize({}))
    .use(passport.session({}))
    .use(authenticate.routes())
    // TODO protect routes
    .use(thingies.routes())
    .use(historyLocations.routes())
    .use(environmentParamsValues.routes());

module.exports = app;
