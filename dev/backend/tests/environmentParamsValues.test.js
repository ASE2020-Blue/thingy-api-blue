const request = require('supertest')
const app = require('../src/server/server')

app.listen(8082);

const baseRoute = "/environmentParamsValue/"

describe('environmentParamsValue Endpoints', () => {
  it(' GET /environmentParamsValue : should get all existing values', async () => {
    const res = await request(app.callback()).get(baseRoute)
    expect(res.status).toBe(200);
    res.body.forEach(e => {
      expect(e).toHaveProperty("id");
      expect(e).toHaveProperty("createdAt");
      expect(e).toHaveProperty("updatedAt");
      expect(e).toHaveProperty("thingyId");
      expect(e).toHaveProperty("value");
      expect(e).toHaveProperty("envParam");
    })
  })
  it(' GET /environmentParamsValue : should get one existing value by id', async () => {
    const res = await request(app.callback()).get(baseRoute)
    expect(res.status).toBe(200);
    if (res.body.length > 0) {
      const id = res.body[0].id
      const resOne = await request(app.callback()).get(baseRoute + id)
      expect(resOne.status).toBe(200);
    }
  })
  it(' GET /environmentParamsValue : should not get an existing value as it doesn\'t exist', async () => {
    const res = await request(app.callback()).get(baseRoute + 555)
    expect(res.status).toBe(404);
  })

  it('PUT /environmentParamsValue : should create a value', async () => {
    const uuid = "rainbow-22";
    const res = await request(app.callback()).put(baseRoute).send(
      {
        uuid: uuid,
        value: 23,
        envParam: "TEMPERATURE"
      })
    expect(res.status).toBe(200);
  })
  it("PUT /environmentParamsValue : should not create the value because a parameter is missing", async () => {
    const uuid = "rainbow-2222";
    const res = await request(app.callback()).put(baseRoute).send(
      {
        uuid: uuid,
        value: 23,
        // envParam: "TEMPERATURE"
      })
    expect(res.status).toBe(400);
  })

  it('DELETE /environmentParamsValue/:id : should delete an existing value', async () => {
    const res = await request(app.callback()).get(baseRoute)
    expect(res.status).toBe(200);
    if (res.body.length > 0) {
      const id = res.body[0].id
      const resDel = await request(app.callback()).delete(baseRoute + id)
      expect(resDel.status).toBe(200);
    }
  })
  it("DELETE /environmentParamsValue/:id : should not delete the value as it doesn\'t exist", async () => {
    const res = await request(app.callback()).delete(baseRoute + 555)
    expect(res.status).toBe(404);
  })
})
