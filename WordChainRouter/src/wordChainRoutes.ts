import { Router, Request, Response } from "express";
import { Kafka, Partitioners } from "kafkajs";
import { createNewRequest, isRequestInDB, RequestStatus, WordChainRequest } from "./common";

const kafkaEndPoint : string = process.env.KAFKA_ENDPOINT || "localhost:9092";
const reqTopic : string = process.env.KAFKA_REQUESTS_TOPIC || "topic-wordchain-request";
const kafka = new Kafka({
    clientId: "wordchainRequestsProd",
    brokers: [kafkaEndPoint],
});

const router = Router();
const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });

router.get("/:start/:end", async (req: Request, res: Response) => {
    const startWord = req.params.start;
    const endWord = req.params.end;

    var entry = await isRequestInDB(startWord, endWord);
    if (entry == null) //never requested
    {
        entry = await createNewRequest(startWord, endWord);

        var name = startWord + "_" + endWord;
        var value = new WordChainRequest(name, startWord, endWord, Date.now());
        await producer.connect();
        await producer.send({
            topic: reqTopic,
            messages: [{key: name, value: JSON.stringify(value)}],
        });

        res.json("new request added, refresh or hit again for result");
    }
    else if (entry.status != RequestStatus.Complete) //
    {
        res.json({
            "message" : "not finished yet, please check again later",
            "entry" : `${JSON.stringify(entry)}`           
        });
    }
    else if (entry.status == RequestStatus.Complete)
    {
        res.json({
            "message" : "Complete",
            "entry" : `${JSON.stringify(entry, replacer)}`           
        });
    }
});

function replacer(key: string, value : string)
{
    if (key=="solutions") 
        return undefined;
    else 
        return value;
}

export default router;
