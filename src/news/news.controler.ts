import express, {Router, Request, Response} from 'express'
import {Controller} from "../types"
import {NewsService} from "./news.service";
import {isAuthenticated} from '../auth/middleware'
import {isNumber} from '../utils/any'

export class NewsController implements Controller {
    path = '/feed'
    router: Router = express.Router()
    newsService = new NewsService()

    constructor() {
        this.initializeRoutes()
    }

    initializeRoutes(): void {
        this.router.get('/', this.getNews)
        this.router.post('/', isAuthenticated, this.addOne)
        this.router.delete('/:id', isAuthenticated, this.removeOne)
    }

    getNews = async (req: Request, res: Response): Promise<void> => {
        const {page, size} = req.query

        if (!(isNumber(page) && isNumber(size))) {
            res.status(400).send('Bad Request.')
        }

        const news = await this.newsService.getNews(page, size)
        res.send(news)
    }

    addOne = async (req: Request, res: Response): Promise<void> => {
        const newsDTO = req.body
        const userId = req.session?.passport.user

        // some validation should be here
        /* if(!this.newsService.validate(newsDTO)){
             res.status(400).send('Bad request')
         }*/

        const news = await this.newsService.createOne(newsDTO, userId)
        res.send({id: news._id})
    }

    removeOne = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id
        const userId = req.session?.passport.user
        const result = await this.newsService.removeOne(id, userId)

        if (!result.done) {
            res.status(409).send('Resource not exist or access to the resource denied.')
        }

        res.send(result)
    }
}