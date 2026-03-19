import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../modules/users/users.model.js";
import userService from "../modules/users/users.services.js";
import invalidatedTokenCache from "../shared/utils/token-cache.js";

const extractToken = ExtractJwt.fromAuthHeaderAsBearerToken();

const opts = {
  jwtFromRequest: extractToken,
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
};

passport.use(
  new JwtStrategy(opts, async (req, jwtPayload, done) => {
    try {
      const token = extractToken(req);
      if (!token || invalidatedTokenCache.has(token)) {
        return done(null, false);
      }

      const user = await User.findById(jwtPayload.userId);
      if (!user || user.authVersion !== jwtPayload.authVersion) {
        return done(null, false);
      }

      req.auth = {
        token,
        payload: jwtPayload,
      };

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      scope: ["profile", "email"],
      callbackURL: process.env.OAUTH_GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await userService.findOrCreateGoogleUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
