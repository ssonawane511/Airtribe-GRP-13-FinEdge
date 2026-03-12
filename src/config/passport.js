import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from '../modules/users/users.model.js';
import userService from '../modules/users/users.services.js';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.userId);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

passport.use(new GoogleStrategy(
    {
        clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
        scope: ["profile", "email"],
        callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL
    },
    async (_accessToken, _refreshToken, profile, done) => {
        try {
            const user = await userService.findOrCreateGoogleUser(profile);
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));


export default passport;