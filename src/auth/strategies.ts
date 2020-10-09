import {Strategy} from 'passport-google-oauth2'
import {IUser, IUserStatic} from "../user/user.model";
import config from 'config'

export const googleStrategy = {
    name: 'google',
    strategy: (User: IUserStatic) => (
        new Strategy({
            clientID: config.get('auth.google.client_id'),
            clientSecret: config.get('auth.google.client_secret'),
            callbackURL: config.get('auth.google.callback_url'),
            passReqToCallback: true,
        }, async function (request: any, accessToken: string, refreshToken: string, profile: any, done: any) {
            try {
                const user = await User.findOne<IUser>({googleId: profile.id})

                if (user) {
                    return done(null, {_id: user._id})
                }
                const result = await User.create<IUser>({
                    googleId: profile.id,
                    name: profile.given_name,
                    email: profile.email,
                    googleAccessToken: accessToken,
                    googleRefreshToken: refreshToken,
                    favorites: []
                })

                return done(null, {_id: result.ops[0]._id})
            } catch (err) {
                return done(err)
            }
        })
    ),
};