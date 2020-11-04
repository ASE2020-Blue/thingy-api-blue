const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const thingies = require("./routes/thingies");
const historyLocations = require("./routes/locationHistories");
const environmentParamsValues = require("./routes/environmentParamsValues");

const { createGRpcServer } = require('./services/server');

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
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(thingies.routes())
  .use(historyLocations.routes())
  .use(environmentParamsValues.routes());

app.listen(8080);

createGRpcServer();
