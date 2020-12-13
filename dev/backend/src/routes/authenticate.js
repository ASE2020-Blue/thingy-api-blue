const Router = require("koa-router");
const passport = require("koa-passport");

const router = new Router({
    prefix: '/auth'
});

const authMiddleware = passport.authenticate(['local', 'jwt'], { assignProperty: 'user' });

router.post('/login', authMiddleware, (ctx) => {
    const { user } = ctx.request.req.user;
    ctx.body = "Hello"
    ctx.status = 200
});

module.exports = router;
