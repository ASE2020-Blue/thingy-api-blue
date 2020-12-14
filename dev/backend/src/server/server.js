const Koa = require("koa");
const router = require("koa-router")();
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");

const thingies = require("../routes/thingies");
const historyLocations = require("../routes/locationHistories");
const environmentParamsValues = require("../routes/environmentParamsValues");

const app = new Koa();

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

function verifyOrigin (ctx) {
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
  .use(bodyParser())
  .use(cors(options))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(thingies.routes())
  .use(historyLocations.routes())
  .use(environmentParamsValues.routes());

module.exports = app;
