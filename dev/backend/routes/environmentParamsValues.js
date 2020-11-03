const Router = require("koa-router")
const router = new Router()
const {environmentParamsValue} = require("../models")

const baseRoute = "/environmentParamsValue"
router.get(baseRoute, getAllValues)
  .get(baseRoute + "/:id", getValue)
  .put(baseRoute, createValue)
  .delete(baseRoute + "/:id", deleteValue)

async function getAllValues(ctx) {
  ctx.body = await environmentParamsValue.findAll()
  ctx.status = 200;
}

async function getValue(ctx) {
  ctx.body = await environmentParamsValue.findByPk(ctx.params.id)
  ctx.status = 200;
}

async function createValue(ctx) {
  const body = ctx.request.body;
  if (!body.value || !body.envParam || !body.thingyId) ctx.throw(400, {'error': '"value,envParam,thingyId" are required fields'});
  ctx.status = 200;

  return environmentParamsValue.upsert(body)
}

async function deleteValue(ctx) {
  const envParam = await environmentParamsValue.findByPk(ctx.params.id)
  if (!envParam) ctx.throw(404, {'error': 'envParam not found'});
  ctx.status = 200;
  return envParam.destroy()
}

module.exports = router
