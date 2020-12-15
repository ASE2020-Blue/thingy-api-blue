const request = require('supertest')
const { initTestDb } = require("./helpers/childProcessDbInitialization");
const { sequelize } = require("../src/models");

const baseRoute = "/thingy/"

describe('thingies Endpoints', () => {
  let app;
  let server;

  beforeAll(async () => {
    await initTestDb();

    // init servers
    const PORT = process.env.PORT || 8084;
    app = require('../src/server/server');
    server = app.listen(PORT);
  });

  afterAll(async () => {
    server.close();
    await sequelize.close();
  });

  it(' GET /thingy : should get all existing thingies', async () => {
    const res = await request(app.callback()).get(baseRoute)
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach(e => {
      expect(e).toHaveProperty("id");
      expect(e).toHaveProperty("createdAt");
      expect(e).toHaveProperty("updatedAt");
      expect(e).toHaveProperty("uuid");
    })
  })
  it('GET /thingy/:uuid : should get one existing thingy', async () => {
    const uuid = "rainbow-22";
    const res = await request(app.callback()).get(baseRoute + uuid)
    expect(res.status).toBe(200);

    let thingy = res.body
    expect(thingy).toHaveProperty("id");
    expect(thingy).toHaveProperty("createdAt");
    expect(thingy).toHaveProperty("updatedAt");
    expect(thingy).toHaveProperty("uuid");
  })
  it('GET /thingy/:uuid : should give error as non existing thingy', async () => {
    const uuid = "thingy12";
    const res = await request(app.callback()).get(baseRoute + uuid)
    expect(res.status).toBe(404);
  })
  it('PUT /thingy : should create a thingy', async () => {
    const uuid = "rainbow-" + new Date().toISOString();
    const res = await request(app.callback()).put(baseRoute).send({uuid: uuid})
    expect(res.status).toBe(200);

    const resT = await request(app.callback()).get(baseRoute + uuid)
    expect(resT.status).toBe(200);
    let thingy = resT.body
    expect(thingy).toHaveProperty("uuid", uuid);
  })
  it('PUT /thingy : should not create the thingy because the uuid already exists', async () => {
    const uuid = "rainbow-22";
    const res = await request(app.callback()).put(baseRoute).send({uuid: uuid})
    expect(res.status).toBe(500);
  })
  it('DELETE /thingy/:uuid : should delete an existing thingy', async () => {
    const uuid = "rainbow-" + new Date().toISOString();
    const resPut = await request(app.callback()).put(baseRoute).send({uuid: uuid})
    expect(resPut.status).toBe(200);
    const resDel = await request(app.callback()).delete(baseRoute + uuid)
    expect(resDel.status).toBe(200);
  })
  it("DELETE /thingy/:uuid : should not delete the thingy as it doesn\'t exist", async () => {
    const uuid = "rainbow-" + new Date().toISOString();
    const res = await request(app.callback()).delete(baseRoute + uuid)
    expect(res.status).toBe(404);
  })
})
