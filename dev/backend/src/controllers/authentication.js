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

function generateJwt (user /** @type User */) {
    return jwt.sign(user, secret, { expiresIn });
}

passport.serializeUser((user /** @type User */, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    try {
        user = await User.findByPk(id);
        if (user) {
            done(null, user);
        } else {
            done(false);
        }
    } catch (e) {
        done(e);
    }
});

const localLogin = new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ where: { email: email.toLowerCase() } });

        if (!user)
            return done(null, false);

        const okPassword = user.comparePassword(password);
        if (okPassword)
            done(null, user);
        else
            done(null, false);
    } catch (e) {
        done(e);
    }
});

const jwtLogin = new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        secretOrKey: secret
    },
    (payload, done) => {
        User.findByPk(payload.id_user).then((user) => {
                if (user)
                    done(null, user);
                else
                    done(null, false);
            })
            .catch((error) => done(error, false));
    }
)

passport.use(localLogin.name, localLogin);
passport.use(jwtLogin.name, jwtLogin);
