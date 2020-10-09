import request from 'request'
import config from 'config'
import {News} from '../news/news.model'

// bad code but I dont have a time for this
export const newsReceiver = (path: string, query: string) => {
    const req: any = request

    req.get(`${config.get('news_api.url')}/${path}?${query}&apiKey=${config.get('news_api.api_key')}`, async (err: Error, res: any, body: any) => {
        const result = JSON.parse(body)
        const articles = result.articles

        const dbRequestResult = await News.insertMany(articles)

        console.log(`Cron job done. Status: ${dbRequestResult.result.ok}. Inserted: ${dbRequestResult.result.n}`)
    })

}