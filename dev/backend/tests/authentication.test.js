const request = require('supertest')
const { initTestDb } = require("./helpers/childProcessDbInitialization");
const { sequelize, User } = require("../src/models");

describe('thingies Endpoints', () => {
    let app;
    let server;
    let user;

    beforeAll(async () => {
        await initTestDb();

        // init servers
        const PORT = process.env.PORT || 8084;
        app = require('../src/server/server');
        server = app.listen(PORT);

        user = await User.create({
            firstname: 'blue',
            lastname: 'dark',
            email: 'blue@unifr.ch',
            password: User.hashPassword('blue-3')
        });
    });

    // afterAll(async () => {
    //     // server.close();
    //     // await sequelize.close();
    // });

    it('Local unauthorized login', async () => {
        const res = await request(app.callback()).post("/auth/login").type("form").send({ email: 'red@unifr.ch', password: 'red-1' });
        expect(res.status).toBe(401);
    });

    it('Local login', async (done) => {
        const res = await request(app.callback())
            .post("/auth/login")
            .type("form")
            .send({ email: 'blue@unifr.ch', password: 'blue-3' });
        expect(res.status).toBe(200);
        done();
    });

    it('Local call api', async () => {
    });

    // it('Local logout', async () => {
    // });
    //
    // it('Jwt login', async () => {
    // });
    //
    // it('Jwt call api', async () => {
    // });
    //
    // it('Jwt logout', async () => {
    // });
})
