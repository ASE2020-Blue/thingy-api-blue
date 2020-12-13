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
        expect(res.headers).toHaveProperty('set-cookie');
        // TODO find the proper way to test with a predicate that one element of the array starts with koa session key
        //  https://www.chaijs.com/plugins/chai-quantifiers/
        //  array example: ["koa.sess=eyJwYXNzcG9ydCI6eyJ1c2VyIjoxfSwiX2V4cGlyZ…DczNCwiX21heEFnZSI6ODY0MDAwMDB9; path=/; httponly", "koa.sess.sig=lHqPmbJFpTPAYRjVb_7_NiLnmYc; path=/; httponly"]
        // expect(res.headers['set-cookies']).to.containExactlyOne(setCookieEntry => setCookieEntry.startsWith("koa.sess="));

        done();
    });

    it('Local call api', async () => {
        // https://visionmedia.github.io/superagent/#saving-cookies
        const agent = request.agent(app.callback());
        const loginResponse = await agent.post("/auth/login")
            .type("form")
            .send({ email: 'blue@unifr.ch', password: 'blue-3' });
        expect(loginResponse.status).toBe(200);

        const res = await agent.get("/thingy");
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('Local logout', async () => {
        const agent = request.agent(app.callback());
        const loginResponse = await agent.post("/auth/login")
            .type("form")
            .send({ email: 'blue@unifr.ch', password: 'blue-3' });
        expect(loginResponse.status).toBe(200);

        const logoutRes = await agent.get("/auth/logout");
        expect(logoutRes.redirect).toBe(true); // redirect with local cookies

        const unauthorizedRes = await agent.get("/thingy");
        expect(unauthorizedRes.unauthorized).toBe(true);
    });
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
