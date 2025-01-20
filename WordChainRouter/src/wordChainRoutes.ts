import { Router, Request, Response } from "express";
import { Kafka } from "kafkajs";
import { createNewRequest, isRequestInDB, WordChainRequest } from "./common";

const kafkaEndPoint : string = process.env.KAFKA_ENDPOINT || "localhost:9092";
const reqTopic : string = process.env.KAFKA_REQUESTS_TOPIC || "topic-wordchain-request";

const kafka = new Kafka({
    clientId: "wordchain-requests",
    brokers: [kafkaEndPoint],
});

const router = Router();
const producer = kafka.producer();

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

        res.json("new request in queue, hit again later");
    }
    else if (entry.shortests == null) //
    {
        res.json("not finished yet, check again later");
    }
    else if (entry.shortests != null)
    {
        res.json(entry);
    }
});

export default router;
