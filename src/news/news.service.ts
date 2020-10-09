import {INews, INewsStatic, News} from "./news.model";
import {pick} from '../utils/object'
import {toNumber} from "../utils/any";

export class NewsService {
    private News: INewsStatic = News

    async getNews(page: any, size: any): Promise<INews[]> {
        const normalizedPage = toNumber(page) as number
        const normalizedSize = toNumber(size) as number

        return this.News.findWithPagin<INews>(normalizedPage, normalizedSize)
    }

    async getById(id: string): Promise<INews | null> {
        return this.News.findById(id)
    }

    async createOne(news: INews, userId: string): Promise<INews> {
            const result = await this.News.create<INews>(Object.assign(this.normalise(news), {publisher: userId}))
        return result.ops[0]
    }

    async removeOne(id: string, userId: string): Promise<{ done: boolean }> {
        const {result} = await this.News.removeOne(id, {publisher: userId})
        return {done: result.n !== 0}
    }

    normalise(news: INews): INews {
        const result = pick(news, ['author', 'title', 'description', 'url', 'urlToImage', 'publishedAt', 'content'])

        result.source = {}
        result.source.id = news.source?.id // validation should remove this assumption
        result.source.name = news.source?.name

        return result
    }
}