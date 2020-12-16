const { initTestDb } = require("./helpers/childProcessDbInitialization");
const { createLocalLoggedInAgent } = require("./helpers/requestLoggedAgent");
const { sequelize } = require("../src/models");

const baseRoute = "/locationHistory/"

describe('locationHistories Endpoints', () => {
    let app;
    let server;
    let loggedInAgent;

    beforeAll(async () => {
        await initTestDb();

        // init servers
        const PORT = process.env.PORT || 8084;
        app = require('../src/server/server');
        server = app.listen(PORT);

        loggedInAgent = await createLocalLoggedInAgent(app);
    });

    afterAll(async () => {
        server.close();
        await sequelize.close();
    });

    it(' GET /locationHistory : should get all existing locationHistories', async () => {
        const res = await loggedInAgent.get(baseRoute)
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
