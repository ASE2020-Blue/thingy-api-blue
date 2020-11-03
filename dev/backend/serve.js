const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const thingys = require("./routes/thingys")
const historyLocations = require("./routes/locationHistorys")
const environmentParamsValues = require("./routes/environmentParamsValues")

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

// response

/*app.use(async ctx => {
  ctx.body = 'Hello World';
});*/



app
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(thingys.routes())
  .use(historyLocations.routes())
  .use(environmentParamsValues.routes());

app.listen(8080);