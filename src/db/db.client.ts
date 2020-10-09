import {MongoClient, Db, ObjectId, ObjectID} from "mongodb"

class DbClient {
    public db: Db

    async connect(): Promise<void> {
        return MongoClient.connect('mongodb://mongo:27017')
            .then(client => {
                this.db = client.db('myDb')
            })
            .catch(err => {
                console.log(`MongoDb connection Error ${err}`)
            })
    }

    getObjectId(id: string): ObjectID {
        return new ObjectId(id)
    }
}

export const dbClient = new DbClient()