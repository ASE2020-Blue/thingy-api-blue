const Router = require("koa-router");
const router = new Router();
const { thingy, locationHistory } = require("../models");

const baseRoute = "/thingy";
router
  .get(baseRoute, getAllThingys)
  .get(baseRoute + "/pending", getAllPendingThingys)
  .get(baseRoute + "/:id", getThingy)
  .get(baseRoute + "/:id/locationHistories", getThingysLocations)
  .put(baseRoute, createThingy)
  .delete(baseRoute + "/:id", deleteThingy);

async function getAllThingys(ctx) {
  ctx.body = await thingy.findAll();
  ctx.status = 200;
}

async function getThingy(ctx) {
  ctx.body = await thingy.findByPk(ctx.params.id);
  ctx.status = 200;
}

async function getThingysLocations(ctx) {
  let t = await thingy.findOne({
    where: {
      id: ctx.params.id,
    },
    include: [
      {
        model: locationHistory,
        required: true,
      },
    ],
  });

  ctx.status = 200;
  ctx.body = t.locationHistories;
}

async function getAllPendingThingys(ctx) {
  let thingys = await thingy.findAll({
    include: [
      {
        model: locationHistory,
      },
    ],
  });

  ctx.body = thingys.filter((thingy) => thingy.locationHistories.length === 0);
  ctx.status = 200;
}

async function createThingy(ctx) {
  const body = ctx.request.body;
  if (!body.name) ctx.throw(400, { error: '"name" is a required field' });
  ctx.status = 200;

  return thingy.upsert(body);
}

async function deleteThingy(ctx) {
  const t = await thingy.findByPk(ctx.params.id);
  if (!t) ctx.throw(404, { error: "thingy not found" });
  ctx.status = 200;
  return t.destroy();
}

module.exports = router;
