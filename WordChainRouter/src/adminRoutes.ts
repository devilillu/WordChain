import { Router, Request, Response } from "express";
import { Kafka } from "kafkajs";

const router = Router();

const kafkaEndPoint : string = process.env.KAFKA_ENDPOINT || "localhost:9092";
const reqTopic : string = process.env.KAFKA_REQUESTS_TOPIC || "topic-wordchain-request";
const resTopic : string = process.env.KAFKA_RESULTS_TOPIC || "topic-wordchain-result";

router.get("/init", async (req: Request, res: Response) => {
    const kafka = new Kafka({
        clientId: "wordchainAdmin",
        brokers: [kafkaEndPoint],
    });

    const admin = kafka.admin();
    await admin.connect();
    await admin.createTopics({
        topics: [{ topic: reqTopic }, { topic: resTopic }],
        waitForLeaders: true,
    });
    await admin.createPartitions({
        topicPartitions: [
            { topic: reqTopic, count: 3 },
            { topic: resTopic, count: 3 }],
    }); 

    res.json("init complete");
});

export default router;
