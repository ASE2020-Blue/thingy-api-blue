const jwt = require("jsonwebtoken");
const passport = require("koa-passport");
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const { User } = require("../models");

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

passport.serializeUser((user /** @type User */, done) => done(null, user.id));

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

passport.use(localLogin.name, localLogin);
passport.use(jwtLogin.name, jwtLogin);
