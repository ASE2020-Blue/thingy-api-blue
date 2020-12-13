const Router = require("koa-router");
const passport = require("koa-passport");
const { generateJwt } = require("../controllers/authentication");

const router = new Router({
    prefix: '/auth'
});

const localAuth = passport.authenticate('local');

router.post('/login', localAuth, (ctx) => {
    ctx.status = 200
    // have to explicitly specify json as accepted response to get a token back
    if ('accept' in ctx.req.headers && ctx.accepts("json"))
        ctx.body = {
            bearerToken: generateJwt(ctx.req.user)
        };
});

router.get('/logout', (ctx) => {
    if (ctx.isAuthenticated()) {
        ctx.logout();
    }
    // TODO switch between accept header
    ctx.redirect('/auth/login');
});

module.exports = router;
