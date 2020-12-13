const request = require('supertest');

const { User } = require("../../src/models");

module.exports.createLocalLoggedInAgent = async function createLocalLoggedInAgent(app, email = 'blue@unifr.ch', password = 'blue-3') {
    await User.create({
        firstname: 'blue',
        lastname: 'dark',
        email,
        password: User.hashPassword(password)
    });

    // https://visionmedia.github.io/superagent/#saving-cookies
    const loggedInAgent = request.agent(app.callback());
    const loginResponse = await loggedInAgent.post("/auth/login")
        .type("form")
        .send({ email, password });
    expect(loginResponse.status).toBe(200);

    return loggedInAgent;
}
