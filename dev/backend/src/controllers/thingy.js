const { EnvironmentParamsValue, Thingy } = require("../models");

module.exports.createEnvValue = async function createEnvValue (uuid, envParam, value) {
    let t = await Thingy.findOne({
        where: { uuid }
    });

    if ( ! t)
        t = await Thingy.upsert({ uuid });

    return await EnvironmentParamsValue.upsert({ value, envParam, thingyId: t.id });
}
