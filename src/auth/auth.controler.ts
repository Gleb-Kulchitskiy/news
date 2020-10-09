import express, {Router, Request, Response,} from 'express'
import {PassportService} from './passport.service'
import {Authenticator} from "passport";

export class AuthController {
    path = '/auth'
    authServerPath: string
    router: Router = express.Router()


    constructor(private passportService?: PassportService) {
        this.authServerPath = `/${this.passportService?.strategyName}`
        this.initializeRoutes()
    }

    initializeRoutes(): void {
        if (this.passportService) {
            this.router.get(this.authServerPath, this.login())
            this.router.get(`${this.authServerPath}/callback`, this.callback())
            this.router.get(this.passportService.successRedirect, this.successAuth)
            this.router.get(this.passportService.failureRedirect, this.failureAuth)
            this.router.get('/logout', this.logout)
        } else {
            //here can be plain authentication
        }
    }

    login = (): () => Authenticator => {
        return this.passportService?.authenticate()
    }

    callback = (): () => Authenticator => {
        return this.passportService?.callback()
    }

    successAuth = (req: Request, res: Response): void => {
        res.send('Authenticated')
    }

    failureAuth = (req: Request, res: Response): void => {
        res.status(401).end('Not Authorized')
    }

    logout = (req:Request, res:Response): void => {
        req.logout()
        res.redirect('/')
    }
}