import {dbClient} from "../db/db.client";
import {INews} from "../news/news.model";

type PluralCollectionMap = {
    [collection: string]: string
}

export interface IStaticBaseModel {
    new(): {};

    getCollectionName: () => string;
    findAll: <T>() => Promise<T[]>;
    find: <T>(filter: { [property: string]: any }) => Promise<T[] | []>
    findWithPagin: <T>(page: number, size: number) => Promise<T[] | []>;
    findById: <T>(id: string) => Promise<T | null>
    findOne: <T>(props: { [property: string]: string }) => Promise<T | null>
    create: <T>(props: T | T[]) => Promise<any>
    removeOne: (id: string, filter: { [property: string]: string }) => Promise<any>
    updateOne: (filter: { [property: string]: any }, update: { [property: string]: any }) => Promise<any>
    aggregateAndFind: (aggregate: { [property: string]: any }[]) => Promise<any>
    insertMany:(news: INews[])=> Promise<any>
}


export const BaseModel: IStaticBaseModel = class BaseModel {
    private static pluralsMap: PluralCollectionMap = {
        news: 'news',
        user: 'users'
    }

    static getCollectionName(): string {
        return this.pluralsMap[this.name.toLowerCase()]
    }

    static create<T>(props: T | T[]): Promise<any> {
        if (Array.isArray(props)) {
            return dbClient.db.collection(this.getCollectionName())
                .insertMany(props)
        }

        return dbClient.db.collection(this.getCollectionName())
            .insertOne(props)
    }

    static findAll<T>(): Promise<T[] | []> {
        return dbClient.db.collection(this.getCollectionName())
            .find({})
            .toArray()
    }

    static find<T>(filter: { [property: string]: any }): Promise<T[] | []> {
        return dbClient.db.collection(this.getCollectionName())
            .find(filter)
            .toArray()
    }

    static findWithPagin<T>(page: number, size: number): Promise<T[]> {
        const skip = page - 1 > 0 ? (page - 1) * size : 0

        return dbClient.db.collection(this.getCollectionName())
            // @ts-ignore
            .find({}, {fields: {_id: 0, publisher: 0}})
            .limit(size)
            .skip(skip)
            .toArray()
    }


    static findById<T>(id: string): Promise<T | null> {
        return dbClient.db.collection(this.getCollectionName())
            .findOne({_id: dbClient.getObjectId(id)})

    }

    static findOne<T>(props: { [property: string]: string }): Promise<T | null> {
        return dbClient.db.collection(this.getCollectionName())
            .findOne(props)
    }

    static removeOne(id: string, filter: { [property: string]: string }): Promise<any> {
        return dbClient.db.collection(this.getCollectionName())
            .deleteOne(Object.assign({_id: dbClient.getObjectId(id)}, filter))
    }

    static updateOne(filter: { [property: string]: any }, update: { [property: string]: any }): Promise<any> {

        return dbClient.db.collection(this.getCollectionName())
            .updateOne(filter, update)
    }

    static aggregateAndFind(aggregate: { [property: string]: any }[]): Promise<any> {
        return dbClient.db.collection(this.getCollectionName())
            .aggregate(aggregate)
            .toArray()
    }

    static insertMany(news: INews[]): Promise<any> {
        return dbClient.db.collection(this.getCollectionName())
            .insertMany(news)
    }
}