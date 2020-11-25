const Router = require("koa-router");
const router = new Router();
const {
  thingy,
  locationHistory,
  environmentParamsValue,
} = require("../models");
const { Op } = require("sequelize");

const baseRoute = "/thingy";
router
  .get(baseRoute, getAllThingies)
  // .get(baseRoute + "/pending", getAllPendingThingies)
  .get(baseRoute + "/:uuid", getThingy)
  .get(baseRoute + "/:uuid/locationHistories", getThingyLocations)
  .get(baseRoute + "/:uuid/environmentParamsValues", getThingyParamValues)
  .put(baseRoute, createThingy)
  .delete(baseRoute + "/:uuid", deleteThingy);

async function getAllThingies(ctx) {
  ctx.body = await thingy.findAll();
  ctx.status = 200;
}

async function getThingy(ctx) {
  let t = await thingy.findOne({
    where: {
      uuid: ctx.params.uuid,
    },
  });
  if (!t) ctx.throw(404, { error: "thingy not found" });
  ctx.body = t;
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
      },
    ],
  });
  if (!t) ctx.throw(404, { error: "thingy not found" });

  ctx.status = 200;
  ctx.body = t.locationHistories;
}

async function getThingyParamValues(ctx) {
  if (!ctx.query.envParam)
    ctx.throw(400, { error: '"envParam" is a required field' });
  let t = await thingy.findOne({
    where: {
      uuid: ctx.params.uuid,
    },
    order: [ environmentParamsValue, 'createdAt' ],
    include: [
      {
        model: environmentParamsValue,
        where: {
          envParam: ctx.query.envParam,
          createdAt: {
            [Op.between]: [
              new Date(ctx.query.dateFrom),
              new Date(ctx.query.dateTo),
            ],
          },
        },
        required: false,
      },
    ],
  });
  if (!t) ctx.throw(404, { error: "thingy not found" });
  //let validValues = t.environmentParamsValues.filter(e => e.createdAt >= new Date(ctx.query.dateFrom) && e.createdAt <= new Date(ctx.query.dateTo))
  ctx.body = t.environmentParamsValues;
  ctx.status = 200;
}

// async function getAllPendingThingies(ctx) {
//   let thingies = await thingy.findAll({
//     include: [
//       {
//         model: locationHistory,
//       },
//     ],
//   });
//
//   ctx.body = thingies.filter((thingy) => thingy.locationHistories.length === 0);
//   ctx.status = 200;
// }

// TODO review: Really? We want to expose such route?
//  Somebody could fill our db for "nothing"
async function createThingy(ctx) {
  const body = ctx.request.body;
  if (!body.uuid) ctx.throw(400, { error: '"uuid" is a required field' });
  ctx.status = 200;

  let updatedThingy = await thingy.upsert(body);
  ctx.body = JSON.parse(JSON.stringify(updatedThingy[0])); // to retrieve only data of thingy

  return updatedThingy;
}

// TODO review: Really? We want to expose such route?
//  Danger zone that open?
async function deleteThingy(ctx) {
  const t = await thingy.findOne({
    where: {
      uuid: ctx.params.uuid,
    },
  });
  if (!t) ctx.throw(404, { error: "thingy not found" });
  ctx.status = 200;
  return t.destroy();
}

module.exports = router;
