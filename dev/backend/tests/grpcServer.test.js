const grpc = require('@grpc/grpc-js');
const {Empty} = require('google-protobuf/google/protobuf/empty_pb');

const { initTestDb } = require("./helpers/childProcessDbInitialization");
const { createLocalLoggedInAgent } = require("./helpers/requestLoggedAgent");
const { createGRpcServer } = require('../src/services/server');
const { ThingyPersistenceClient } = require('../src/proto/thingy_grpc_pb');
const { ThingyLocation } = require('../src/proto/thingy_pb');
const { sequelize, Thingy } = require("../src/models");

const uuid = "uuid123"

describe('Test thingy server', () => {
    let app;
    let server;
    let thingyPersistClient;
    let grpcServer;
    let loggedInAgent;

    beforeAll(async () => {
        await initTestDb();

        // init servers
        const PORT = process.env.PORT || 8084;
        app = require('../src/server/server');
        server = app.listen(PORT);
        grpcServer = await createGRpcServer();

        // create grpc client
        const {BACKEND_GRPC_BIND_PORT} = process.env;
        thingyPersistClient = new ThingyPersistenceClient(
            `127.0.0.1:${BACKEND_GRPC_BIND_PORT}`,
            grpc.credentials.createInsecure()
        );

        // Adding reference thingy into db
        const thingyRecord = await Thingy.create({uuid});
        expect(thingyRecord).not.toBeNull();
        expect(thingyRecord.id).toBeGreaterThan(0);

        loggedInAgent = await createLocalLoggedInAgent(app);
    });

    afterAll(async () => {
        grpcServer.forceShutdown();
        server.close();
        await sequelize.close();
    });

    it('getPendingLocation', async () => {
        const promise = new Promise((resolve, reject) => {
            const thingies = [];
            const pendingLocationStream = thingyPersistClient.getPendingLocation(new Empty());
            pendingLocationStream.on('data', (thingy) => {
                thingies.push(thingy);
            });
            pendingLocationStream.on('end', () => {
                resolve(thingies);
            });
            pendingLocationStream.on('error', reject);
        });
        let pendingThingies = await promise;
        pendingThingies = pendingThingies.map(e => e.array[0])
        expect(pendingThingies.length).toBeGreaterThan(0);
        expect(pendingThingies).toContain(uuid)
    })

    it('setNewLocation - existing uuid', async () => {
        const locationName = "test location"
        const thingyLocation = new ThingyLocation()
        thingyLocation.setThingyUuid(uuid)
        thingyLocation.setLocation(locationName)
        const promise = new Promise((resolve, reject) => {
            thingyPersistClient.setNewLocation(thingyLocation, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        await promise;
        let locations = await loggedInAgent.get("/locationHistory/");
        locations = locations.body.map(location => location.locationName)// .map(locationName);
        expect(locations).toContain(locationName);
    })

    it('setNewLocation - non existing uuid', async () => {
        let exception = false;
        try {
            const thingyLocation = new ThingyLocation()
            thingyLocation.setThingyUuid("abc")
            thingyLocation.setLocation("Home")
            let promise = new Promise((resolve, reject) => {
                thingyPersistClient.setNewLocation(thingyLocation, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
            await promise;
        } catch (e) {
            exception = true
        }
        expect(exception).toBe(true)
    })
})

