const Router = require("koa-router")

const { localOrJwtAuth } = require("../controllers/authentication");
const { createEnvValue } = require("../controllers/thingy");
const { EnvironmentParamsValue } = require("../models")

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
    if (!value) ctx.throw(404, { error: "environment value not found" });
    ctx.body = value
    ctx.status = 200;
}

async function createValue(ctx) {
    const { value, envParam, uuid } = ctx.request.body;
    if (!value || !envParam || !uuid)
        ctx.throw(400, { 'error': '"value,envParam,uuid" are required fields' });

    await createEnvValue(uuid, envParam, value);
    ctx.status = 200;
}

async function deleteValue(ctx) {
    const envParam = await EnvironmentParamsValue.findByPk(ctx.params.id)
    if (!envParam) ctx.throw(404, { 'error': 'envParam not found' });
    ctx.status = 200;
    return envParam.destroy()
}

module.exports = router
