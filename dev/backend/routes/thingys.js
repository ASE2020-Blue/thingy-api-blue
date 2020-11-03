const Router = require("koa-router")
const router = new Router()
const {thingy} = require("../models")

const baseRoute = "/thingy"
router.get(baseRoute, getAllThingys)
  .get(baseRoute + "/:id", getThingy)
  .put(baseRoute, createThingy)
  .delete(baseRoute + "/:id", deleteThingy)

async function getAllThingys(ctx) {
  ctx.body = await thingy.findAll()
  ctx.status = 200;
}

async function getThingy(ctx) {
  ctx.body = await thingy.findByPk(ctx.params.id)
  ctx.status = 200;
}

async function createThingy(ctx) {
  const body = ctx.request.body;
  if (!body.name) ctx.throw(400, {'error': '"name" is a required field'});
  ctx.status = 200;

  return thingy.upsert(body)
}

async function deleteThingy(ctx) {
  const t = await thingy.findByPk(ctx.params.id)
  if (!t) ctx.throw(404, {'error': 'thingy not found'});
  ctx.status = 200;
  return t.destroy()
}

module.exports = router
