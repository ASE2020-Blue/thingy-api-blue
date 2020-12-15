const { sendUnaryData, ServerWritableStream } = require('@grpc/grpc-js');
const { Empty } = require('google-protobuf/google/protobuf/empty_pb');

const { createEnvValue } = require("../../controllers/thingy");
const { Thingy, LocationHistory } = require("../../models");
const { IThingyPersistenceServer } = require('../../proto/thingy_grpc_pb');

class ThingyServer /** @implements IThingyPersistenceServer */ {

    constructor() {
    }

    getPendingLocation(call /** @type {ServerWritableStream<Empty, ThingyLocation>} */) {
        console.log(`${new Date().toISOString()}    getPendingLocation`);
        // Agree, await are great, but don't want to tree to set this method as async for now
        Thingy
            .findAll({
                include: [
                    {
                        model: LocationHistory,
                    },
                ],
            })
            .then((thingies) => {
                thingies
                    .filter(thingy => thingy.locationHistories.length === 0)
                    .map(thingy => thingy.getGRpcLocation())
                    .forEach(simpleThingy => {
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

        if (!thingyUuid || !thingyLocation) {
            callback(new Error('BadRequest, missing or invalid params!'));
            return;
        }

        Thingy
            .findOne({
                where: {
                    uuid: thingyUuid
                }
            })
            .then(foundThingy => {
                if (!foundThingy)
                    callback(new Error('NotFound, no corresponding uuid: ' + thingyUuid));
                else
                    LocationHistory.upsert({
                            locationName: thingyLocation,
                            thingyId: foundThingy.id
                        })
                        .then(() => callback(null, new Empty()))
                        .catch(callback);
            })
    }

    setNewValue(call /** @type ServerUnaryCall<ThingyValue, Empty> */, callback /** @type sendUnaryData<Empty> */) {
        console.log(`${new Date().toISOString()}    setNewValue`);
        const thingyUuid = call.request.getThingyUuid();
        const envParam = call.request.getEnvParam();
        const value = call.request.getValue();
        console.log(`\t${thingyUuid}[${envParam}]: ${value}`);

        if ( ! thingyUuid || ! envParam || ! value) {
            callback(new Error('BadRequest, missing or invalid params!'));
            return;
        }

        createEnvValue(thingyUuid, envParam, value)
            .then(() => callback(null, new Empty()), error => callback(error));
    }
}

module.exports = {
    ThingyServer
}
