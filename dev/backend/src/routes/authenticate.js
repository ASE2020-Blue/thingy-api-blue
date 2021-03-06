const Router = require("koa-router");
const passport = require("koa-passport");
const { generateJwt } = require("../controllers/authentication");

const router = new Router({
    prefix: '/auth'
});

const localAuth = passport.authenticate('local');

/**
 * Try to login with a user, using a email and password (see local strategy in the authentication controller).
 * If it is explicitly specified that the accepted respond should be in json, then, it will generate a Json Web Token
 * and return it in a property called: `bearerToken`.
 */
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
    // route vue router
    ctx.redirect('/login');
});

module.exports = router;
