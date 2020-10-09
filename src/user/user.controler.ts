import express, {Request, Response, Router} from 'express'
import {Controller} from "../types"
import {UserService} from './user.service'
import {isAuthenticated} from '../auth/middleware'

export class UserController implements Controller {
    path = '/favorites'
    router: Router = express.Router()
    userService = new UserService()

    constructor() {
        this.initializeRoutes()
    }

    initializeRoutes(): void {
        this.router.get('/', isAuthenticated, this.getFavorites)
        this.router.post('/save/:id', isAuthenticated, this.addToFavorite)
        this.router.delete('/:id', isAuthenticated, this.removeFromFavorite)
    }

    getFavorites = async (req: Request, res: Response): Promise<void> => {
        const userId = req.session?.passport.user
        // i think we dont need pagination here
        const news = await this.userService.getAllFavorites(userId)

        res.send(news)
    }

    addToFavorite = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id
        const userId = req.session?.passport.user
        const result = await this.userService.addToFavorite(userId, id)

        res.send(result)
    }

    removeFromFavorite = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id
        const userId = req.session?.passport.user
        const result = await this.userService.removeFromFavorite(userId, id)

        res.send(result)
    }
}