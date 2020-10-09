import {BaseModel} from "../model/baseModel"

export interface INews {
    _id?: string;
    publisher?: string;
    source: {
        id: number | null;
        name: string;
    },
    author: string;
    title: string
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface INewsStatic {
    new(properties: INews): INews

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

export const News: INewsStatic = class News extends BaseModel implements INews {
    source: {
        id: number | null
        name: string
    }
    author: string
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: string
    content: string

    constructor(properties: INews) {
        super()
        Object.assign(this, properties)
    }
}