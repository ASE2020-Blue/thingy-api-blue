const Router = require("koa-router");

const { localOrJwtAuth } = require("../controllers/authentication");
const { LocationHistory } = require("../models");

const router = new Router({
    prefix: "/locationHistory"
});

router
    .use(localOrJwtAuth)
    .get("/", getAllLocationHistory)
    // .put("/", createLocationHistory)
    .delete("/:id", deleteLocationHistory)

async function getAllLocationHistory(ctx) {
    ctx.body = await LocationHistory.findAll()
    ctx.status = 200;
}

// async function createLocationHistory(ctx) {
//   const body = ctx.request.body;
//   if (!body.locationName || ! body.uuid) ctx.throw(400, {'error': '"locationName" and "thingyId" are required fields'});
//   let t = await thingy.findOne({
//     where: {
//       uuid: body.uuid
//     }
//   });
//   if (!t) ctx.throw(404, { error: "thingy not found" });
//   ctx.status = 200;
//   return locationHistory.upsert({locationName: body.locationName, thingyId: t.id})
// }

async function deleteLocationHistory(ctx) {
    const location = await locationHistory.findByPk(ctx.params.id)
    if (!location) ctx.throw(404, { 'error': 'location not found' });
    ctx.status = 200;
    return location.destroy()
}

module.exports = router
