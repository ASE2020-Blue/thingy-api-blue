const jwt = require("jsonwebtoken");
const passport = require("koa-passport");
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { User } = require("../models");

/*
 * In this file, we globally initialize the passport behavior and its strategy.
 * A couple of exported functions are still available to use in the app:
 *  - generateJwt: generate a token (string) to be used in future calls in the authorization header
 *  - localOrJwtAuth: a middleware, to make sure the user is either authenticated with the 'local' strategy
 *    (session/cookie) or will try to authenticate the user with a authorization header using the 'jwt' strategy.
 *
 * Article that helped to develop the authentication: https://mherman.org/blog/user-authentication-with-passport-and-koa/
 */

// TODO move
/**
 * Generate with: `openssl rand -base64 32`
 */
const secret = "nXCoRWQoxLEVH0/ZRQmDDw==";
/**
 * In seconds.
 * 3600 sec = 60 min = 1 h
 */
const expiresIn = 3600;

module.exports.generateJwt = function generateJwt ({ id } /** @type User */) {
    return jwt.sign({ id }, secret, { expiresIn });
}

/**
 * Function used to know how to serialize the user in the session/cookie.
 * Here, keep it small with serializing only the id.
 */
passport.serializeUser((user /** @type User */, done) => done(null, user.id));

/**
 * When getting a session/cookie, retrieve the user with the serialized property.
 * @see {passport#serializeUser}
 */
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        if (!user)
            return done(false);

        done(null, user);
    } catch (e) {
        done(e);
    }
});

/**
 * Local strategy to login the user with email and password.
 */
const localLogin = new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        /** @type User */
        const user = await User.findOne({ where: { email: email.toLowerCase() } });

        if (!user)
            return done(null, false);

        const okPassword = user.comparePassword(password);
        if (!okPassword)
            return done(null, false);

        done(null, user);
    } catch (e) {
        done(e);
    }
});

/**
 * JSON Web Token strategy to login the user with a authorization header and a bearer token.
 * This will authenticate the user in case there is a token in the header and when extracting the payload of the token,
 * match the id of a user.
 *
 * @see {#exports.generateJwt}
 */
const jwtLogin = new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret
    },
    async (payload, done) => {
        try {
            const user = await User.findByPk(payload.id)
            if (user)
                done(null, user);
            else
                done(null, false);
        } catch (e) {
            done(error, false);
        }
});

// register the different strategy in the global passport
passport.use(localLogin.name, localLogin);
passport.use(jwtLogin.name, jwtLogin);

/**
 * Middleware that will either pass through in case a user could already be retrieved from the session/cookie,
 * or else, try to authenticate with the `jwt` strategy.
 *
 * To retrieve the user in the contex: `const { user } = ctx.req;`
 */
module.exports.localOrJwtAuth = async function (ctx, next) {
    if (ctx.isAuthenticated())
        // already authenticated in the session (using the local strategy and the cookies of the request
        await next();
    else {
        await passport.authenticate('jwt')(ctx, next);
    }
}
