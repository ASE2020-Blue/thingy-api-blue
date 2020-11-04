const Router = require("koa-router");
const router = new Router();
const { thingy, locationHistory } = require("../models");

const baseRoute = "/thingy";
router
  .get(baseRoute, getAllThingies)
  .get(baseRoute + "/pending", getAllPendingThingies)
  .get(baseRoute + "/:uuid", getThingy)
  .get(baseRoute + "/:uuid/locationHistories", getThingyLocations)
  .put(baseRoute, createThingy)
  .delete(baseRoute + "/:uuid", deleteThingy);

async function getAllThingies(ctx) {
  ctx.body = await thingy.findAll();
  ctx.status = 200;
}

async function getThingy(ctx) {
  let t = await thingy.findOne({
    where: {
      uuid: ctx.params.uuid
    }
  });
  if (!t) ctx.throw(404, { error: "thingy not found" });
  ctx.body = t
  ctx.status = 200;
}

async function getThingyLocations(ctx) {
  let t = await thingy.findOne({
    where: {
      uuid: ctx.params.uuid,
    },
    include: [
      {
        model: locationHistory,
        required: true,
      },
    ],
  });
  if (!t) ctx.throw(404, { error: "thingy not found" });

  ctx.status = 200;
  ctx.body = t.locationHistories;
}

async function getAllPendingThingies(ctx) {
  let thingies = await thingy.findAll({
    include: [
      {
        model: locationHistory,
      },
    ],
  });

  ctx.body = thingies.filter((thingy) => thingy.locationHistories.length === 0);
  ctx.status = 200;
}

// TODO review: Really? We want to expose such route?
//  Somebody could fill our db for "nothing"
async function createThingy(ctx) {
  const body = ctx.request.body;
  if (!body.uuid) ctx.throw(400, { error: '"uuid" is a required field' });
  ctx.status = 200;

  return thingy.upsert(body);
}

// TODO review: Really? We want to expose such route?
//  Danger zone that open?
async function deleteThingy(ctx) {
  const t = await thingy.findOne({
    where: {
      uuid: ctx.params.uuid
    }
  });
  if (!t) ctx.throw(404, { error: "thingy not found" });
  ctx.status = 200;
  return t.destroy();
}

module.exports = router;
