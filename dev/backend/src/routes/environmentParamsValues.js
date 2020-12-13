const Router = require("koa-router")

const {localOrJwtAuth} = require("../controllers/authentication");
const {EnvironmentParamsValue, Thingy} = require("../models")

const router = new Router({
    prefix: "/environmentParamsValue"
})

router
    .use(localOrJwtAuth)
    .get("/", getAllValues)
    .get("/:id", getValue)
    .put("/", createValue)
    .delete("/:id", deleteValue)

async function getAllValues(ctx) {
    ctx.body = await EnvironmentParamsValue.findAll()
    ctx.status = 200;
}

async function getValue(ctx) {
    const value = await EnvironmentParamsValue.findByPk(ctx.params.id)
    if (!value) ctx.throw(404, {error: "environment value not found"});
    ctx.body = value
    ctx.status = 200;
}

async function createValue(ctx) {
    const body = ctx.request.body;
    const {value, envParam, uuid} = body
    if (!value || !envParam || !uuid) ctx.throw(400, {'error': '"value,envParam,uuid" are required fields'});
    let t = await Thingy.findOne({
        where: {uuid}
    });
    if (!t)
        t = await Thingy.upsert({uuid});
    ctx.status = 200;
    return EnvironmentParamsValue.upsert({value: value, envParam: envParam, thingyId: t.id})
}

async function deleteValue(ctx) {
    const envParam = await EnvironmentParamsValue.findByPk(ctx.params.id)
    if (!envParam) ctx.throw(404, {'error': 'envParam not found'});
    ctx.status = 200;
    return envParam.destroy()
}

module.exports = router
