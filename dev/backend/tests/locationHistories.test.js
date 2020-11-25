const request = require('supertest')
const app = require('../src/server/server')

app.listen(8081);

const baseRoute = "/locationHistory/"

describe('locationHistories Endpoints', () => {
  it(' GET /locationHistory : should get all existing locationHistories', async () => {
    const res = await request(app.callback()).get(baseRoute)
    expect(res.status).toBe(200);
    res.body.forEach(e => {
      expect(e).toHaveProperty("id");
      expect(e).toHaveProperty("createdAt");
      expect(e).toHaveProperty("updatedAt");
      expect(e).toHaveProperty("thingyId");
      expect(e).toHaveProperty("locationName");
    })
  })
})
