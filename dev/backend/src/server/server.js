const Koa = require('koa');
const router = require('koa-router')();
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
  .use(bodyParser())
  .use(cors({
    credentials: true
  }))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(passport.initialize({}))
  .use(passport.session({}))
  .use(authenticate.routes())
  .use(thingies.routes())
  .use(historyLocations.routes())
  .use(environmentParamsValues.routes());

module.exports = app;
