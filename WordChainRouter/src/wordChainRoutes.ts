import { Router, Request, Response } from "express";
import { Kafka } from "kafkajs";

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

    //for now forward anything as new
    if (false)//haveResult(startWord, endWord))
    {
        res.json("result known");
    }
    else
    {
        await producer.connect();
        await producer.send({
            topic: reqTopic,
            messages: [{key: startWord + "_" + endWord, value: JSON.stringify([startWord, endWord])}],
        });

        res.json("now in queue");
    }
});

export default router;
