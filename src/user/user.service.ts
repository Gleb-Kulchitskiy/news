import {dbClient} from "../db/db.client";
import {INewsStatic, INews, News} from "../news/news.model";
import {IUserStatic, IUser, User} from "./user.model";
import {JsonResponse} from '../types'

export class UserService {
    private News: INewsStatic = News
    private User: IUserStatic = User

    async getAllFavorites(userId: string)/*: Promise<INews[]>*/ {
        //this is a bad solution to solve this problem, but I could not find a way to get the data using aggregation
        const user = await User.findById<IUser>(userId)
        const favorites = user && user.favorites || []

        const filter = {_id: {$in: favorites.map(id => dbClient.getObjectId(id))}}
        const result = await this.News.find<INews>(filter) as INews[]

        return result.map((news: INews) => {
            delete news._id
            delete news.publisher

            return news
        })
    }

    async addToFavorite(userId: string, id: string): Promise<JsonResponse> {
        const userObjectId = dbClient.getObjectId(userId)
        const newsObjectId = dbClient.getObjectId(id)

        const data = await this.User.updateOne({_id: userObjectId}, {$addToSet: {favorites: newsObjectId}})

        return {done: data.result.nModified === 1 && data.result.ok === 1}
    }

    async removeFromFavorite(userId: string, id: string)/*:Promise<JsonResponse>*/ {
        const userObjectId = dbClient.getObjectId(userId)
        const newsObjectId = dbClient.getObjectId(id)

        const data = await this.User.updateOne({_id: userObjectId}, {$pull: {favorites: newsObjectId}})

        return {done: data.result.nModified === 1 && data.result.ok === 1}
    }
}