const { sendUnaryData, ServerWritableStream } = require('@grpc/grpc-js');
const { Empty } = require('google-protobuf/google/protobuf/empty_pb');
const { IPersistLocalizationServer } = require('../../proto/thingy_grpc_pb');

const { thingy, locationHistory } = require("../../models");

class ThingyServer /** @implements IPersistLocalizationServer */ {

    constructor() {
    }

    getPendingLocation(call /** @type {ServerWritableStream<Empty, ThingyLocalization>} */) {
        console.log(`${new Date().toISOString()}    getPendingLocation`);
        // Agree, await are great, but don't want to tree to set this method as async for now
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
                    .map(thingy => thingy.getGRpcLocation())
                    .forEach(simpleThingy => {
                        console.log(simpleThingy);
                        call.write(simpleThingy);
                    });
                call.end();
            })
    }

    setNewLocation(call /** @type ServerUnaryCall<ThingyLocalization, Empty> */, callback /** @type sendUnaryData<Empty> */) {
        console.log(`${new Date().toISOString()}    setNewLocation`);
        const thingyUuid = call.request.getThingyUuid();
        const thingyLocation = call.request.getLocation();
        console.log(`\t${thingyUuid}: ${thingyLocation}`);

        if ( ! thingyUuid || ! thingyLocation) {
            callback(new Error('BadRequest, missing or invalid params!'));
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
                    callback(new Error('NotFound, no corresponding uuid: ' + thingyUuid));
                else
                    locationHistory.upsert({
                        locationName: thingyLocation,
                        thingyId: foundThingy.id
                    })
                        .then(() => callback(null, new Empty()))
                        .catch(callback);
            })
    }
}

module.exports = {
    ThingyServer
}
