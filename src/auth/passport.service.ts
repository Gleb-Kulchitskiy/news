import passport, {PassportStatic, Strategy} from "passport";
import {User, IUserStatic, IUser} from "../user/user.model";

type Done = (error: Error | null, user?: any, info?: any) => any

export class PassportService {
    passport: PassportStatic = passport
    User: IUserStatic = User

    constructor(public strategyName: string, public strategy: (User: IUserStatic) => Strategy, public successRedirect: string, public failureRedirect: string) {
        this.initialize()
    }

    initialize() {
        this.passport.use(this.strategy(this.User))
        this.passport.serializeUser(this.serialize);
        this.passport.deserializeUser(this.deserialize);
    }

    serialize = (user: IUser, done: any): void => {
        done(null, user._id);
    }

    deserialize = async (id: string, done: Done): Promise<void> => {
        try {
            const user = await User.findById<IUser>(id);
            done(null, {_id: user?._id, name: user?.name})
        } catch (err) {
            done(err, null)
        }
    }

    authenticate = () => {
        const options: { [key: string]: string[] | string } = {}
        if (this.strategyName === 'google') {
            options.scope = ['profile', 'email']
            options.accessType = 'offline'
            options.prompt = 'consent'
        }

        return this.passport.authenticate(this.strategyName, options)
    }

    callback() {
        console.log('success', this.successRedirect)
        return this.passport.authenticate(this.strategyName, {
            successRedirect: `/auth${this.successRedirect}`,
            failureRedirect: `/auth/${this.failureRedirect}`
        })
    }
}