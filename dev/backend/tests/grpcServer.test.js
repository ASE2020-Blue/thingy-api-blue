const request = require('supertest')
const app = require('../src/server/server')

const grpc = require('@grpc/grpc-js');
const { createGRpcServer } = require('../src/services/server');
const { PersistLocalizationClient } =require('../src/proto/thingy_grpc_pb');
const { ThingyLocalization } = require('../src/proto/thingy_pb');
const { Empty } = require('google-protobuf/google/protobuf/empty_pb');

// init servers
const PORT = process.env.PORT || 8084;
app.listen(PORT);
createGRpcServer();

// create grpc client
const { BACKEND_GRPC_BIND_PORT } = process.env;
const persistLocalizationClient = new PersistLocalizationClient(
  `backend:${BACKEND_GRPC_BIND_PORT}`,
  grpc.credentials.createInsecure()
);

const uuid = "uuid123"

describe('Test thingy server', () => {
  it('getPendingLocation', async () => {
    const thingy = await request(app.callback()).put(/thingy/).send({uuid: uuid});
    expect(thingy.status).toBe(200)

    const promise =  new Promise((resolve, reject) => {
      const thingies = [];
      const pendingLocationStream = persistLocalizationClient.getPendingLocation(new Empty());
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
    expect(pendingThingies).toContain(thingy.body.uuid)
    await request(app.callback()).delete("/thingy/" + uuid)
  })

  it('setNewLocation - existing uuid', async () => {
    const thingy = await request(app.callback()).put(/thingy/).send({uuid: uuid});
    expect(thingy.status).toBe(200)

    const locationName = "home"
    const thingyLocation = new ThingyLocalization()
    thingyLocation.setThingyUuid(uuid)
    thingyLocation.setLocation(locationName)
    const promise = new Promise((resolve, reject) => {
      persistLocalizationClient.setNewLocation(thingyLocation, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    await promise;
    let locations = await request(app.callback()).get("/locationHistory/");
    locations = locations.body.map(location => location.locationName)// .map(locationName);
    expect(locations).toContain(locationName);

    await request(app.callback()).delete("/thingy/" + uuid)
  })

  it('setNewLocation - non existing uuid', async () => {
    let exception = false;
    try {
      const thingyLocation = new ThingyLocalization()
      thingyLocation.setThingyUuid("abc")
      thingyLocation.setLocation("Home")
      let promise = new Promise((resolve, reject) => {
        persistLocalizationClient.setNewLocation(thingyLocation, (error) => {
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

