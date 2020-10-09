import express, {Application, Request, Response} from 'express'
import bodyParser from 'body-parser'
import {Controller} from './types'
import {PassportStatic} from 'passport'
import session from 'express-session'
import config from 'config'

export class App {
    expressApp: Application = express()

    constructor(private controllers: Controller[], private passport?: PassportStatic) {
        this.initializeMiddlewares()
        this.initializeControllers(controllers)
    }

    private initializeMiddlewares() {
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(session({
            secret: config.get('session.secret'),
            resave: false,
            rolling: true,
            saveUninitialized: true,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 1000
            }
        }))

        if (this.passport) {
            this.expressApp.use(this.passport.initialize())
            this.expressApp.use(this.passport.session())
        }
    }

    private initializeControllers(controllers: Controller[]) {
        // this string should not be here
        this.expressApp.get('/', (req: Request, res: Response) => res.send('Hi there'))

        controllers.forEach((controller) => {
            this.expressApp.use(controller.path, controller.router);
        });
    }
}