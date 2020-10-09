import {BaseModel} from "../model/baseModel";
import {INews} from "../news/news.model";

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    favorites: string[];
    googleId?: string;
    googleAccessToken?: string
    googleRefreshToken?: string
}

export interface IUserStatic {
    new(properties: IUser): IUser

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

export const User: IUserStatic = class User extends BaseModel implements IUser {
    name: string;
    email: string;
    favorites: string[] = []

    constructor(properties: IUser) {
        super()
        Object.assign(this, properties)
    }
}