import * as mongoDB from "mongodb";

export class WordChainEntry {
    constructor(
        public status?: RequestStatus,
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

export enum RequestStatus {
    Queued,
    Running,
    Complete
}

export async function connectToDatabase() : Promise<mongoDB.Collection> {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING || "mongodb://root:example@localhost:27017");            
    await client.connect();        
    const db: mongoDB.Db = client.db(process.env.DB_NAME || "wordchain");   
    const recordsCollection: mongoDB.Collection = db.collection(process.env.WORDCHAIN_COLLECTION_NAME || "dev");
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${recordsCollection.collectionName}`);
    return recordsCollection;
 }

 export async function update(updatedRecord: WordChainEntry, collection: mongoDB.Collection) : Promise<boolean> {
     try {
        const query = {  "start": updatedRecord.start, "end": updatedRecord.end };     
        const result = await collection.updateOne(query, { $set: updatedRecord });
        return result ? true : false;
     } catch (error) {
         console.error(error);
         return false;
     }
 }