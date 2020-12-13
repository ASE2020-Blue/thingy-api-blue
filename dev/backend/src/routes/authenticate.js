const Router = require("koa-router");
const passport = require("koa-passport");

const router = new Router({
    prefix: '/auth'
});

/**
 * To retrieve the user: `const { user } = ctx.req;`
 */
const authMiddleware = passport.authenticate(['local', 'jwt']);

router.post('/login', authMiddleware, (ctx) => {
    ctx.status = 200
});

router.get('/logout', (ctx) => {
    if (ctx.isAuthenticated()) {
        ctx.logout();
    }
    // TODO switch between accept header
    ctx.redirect('/auth/login');
});

module.exports = router;
