import * as mongoDB from "mongodb";
import { ObjectId } from "mongodb";

export class WordChainRequest {
    constructor(
        public name: string, 
        public start: string,
        public end: string,
        public date: number) {}
}

export class WordChainEntry {
    constructor(
        public name?: string, 
        public start?: string,
        public end?: string,
        public runtime?: number,
        public solutions?: string[],
        public shortests?: string[],
        public algorithm?: string,
        public error?: string,
        public id?: string) {}
}

export async function connectToDatabase() : Promise<mongoDB.Collection> {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING || "mongodb://root:example@localhost:27017");
    await client.connect();        
    const db: mongoDB.Db = client.db(process.env.DB_NAME || "wordchain");   
    const recordsCollection: mongoDB.Collection = db.collection(process.env.WORDCHAIN_COLLECTION_NAME || "dev");
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${recordsCollection.collectionName}`);
    return recordsCollection;
 }

export async function isRequestInDB(startWord: string, endWord: string): Promise<WordChainEntry | null> {
    var collection = await connectToDatabase();
    return await getFirst(startWord, endWord, collection);
}

export async function createNewRequest(startWord: string, endWord: string): Promise<WordChainEntry> {
    var collection = await connectToDatabase();
    
    var newEntry = new WordChainEntry(); 
    newEntry.name = `${startWord}_${endWord}`;
    newEntry.start = startWord;
    newEntry.end = endWord;
    
    var newId = await post(newEntry, collection);
    
    if (newId != undefined)
    {
        var checkedEntry = await getFirstById(newId, collection);
        if (checkedEntry != undefined)
            return checkedEntry;
        console.warn("failure expected, couldn't double DB entry");
    }

    return newEntry;
}

async function post(rewRecord: WordChainEntry, collection: mongoDB.Collection) : Promise<string | undefined> {
    try {
        const result = await collection.insertOne(rewRecord);
        return result ? result.insertedId.toString() : undefined;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

async function getFirst(startWord: string, endWord: string, collection: mongoDB.Collection) : Promise<WordChainEntry | null> {
    try {        
        const query = {  "start": startWord, "end": endWord };
        const record = (await collection.findOne(query)) as WordChainEntry;
        return record;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getFirstById(id: string, collection: mongoDB.Collection) : Promise<WordChainEntry | undefined> {
    try {        
        const query = { _id:  new ObjectId(id) };
        const record = (await collection.findOne(query)) as WordChainEntry;
        return record;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}