const { sendUnaryData, ServerWritableStream } = require('@grpc/grpc-js');
const { IPersistLocalizationServer } = require('../../proto/thingy_grpc_pb');

const { thingy, locationHistory } = require("../../models");

class ThingyServer /** @implements IPersistLocalizationServer */ {

    constructor() {
    }

    getPendingLocation(call /** @type {ServerWritableStream<Empty, ThingyLocalization>} */) {
        console.log(`${new Date().toISOString()}    getPendingLocation`);
        // Aggree, await are great, but don't want to tree to set this method as async for now
        thingy
            .findAll({
                include: [
                    {
                        model: locationHistory,
                    },
                ],
            })
            .then((thingies) => {
                thingies
                    .filter(thingy => thingy.locationHistories.length === 0)
                    .map(({ uuid }) => ({ thingy_uuid: uuid }))
                    .forEach(call.write);
                call.end();
            })
    }

    setNewLocation(call /** @type ServerUnaryCall<ThingyLocalization, Empty> */, callback /** @type sendUnaryData<Empty> */) {
        console.log(`${new Date().toISOString()}    setNewLocation`);
        const thingyUuid = call.request.getThingyUuid();
        const thingyLocation = call.request.getLocation();
        console.log(`\t${thingyUuid}: ${thingyLocation}`);

        if ( ! thingyUuid || ! thingyLocation) {
            callback(new Error('BadRequest, missing params!'));
            return;
        }

        thingy
            .findOne({
                where: {
                    uuid: thingyUuid
                }
            })
            .then(foundThingy => {
                if ( ! foundThingy)
                    callback(new Error('NotFound, no corresponding uuid'));
                else
                    locationHistory.upsert({
                        locationName: thingyLocation,
                        thingyId: foundThingy.id
                    })
                        .catch(callback);
            })
    }
}

module.exports = {
    ThingyServer
}
