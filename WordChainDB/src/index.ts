import { connectToDatabase, update, WordChainEntry } from "./common";
import { EachMessagePayload, Kafka } from "kafkajs";

const kafkaEndPoint : string = process.env.KAFKA_ENDPOINT || "localhost:9092";
const resTopic : string = process.env.KAFKA_RESULTS_TOPIC || "topic-wordchain-result";
const kafkaRes = new Kafka({
    clientId: "wordchain-results-db",
    brokers: [kafkaEndPoint],
});
const consumer = kafkaRes.consumer({ groupId: 'results-consumer-group' })

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: resTopic, fromBeginning: true });
    await consumer.run({eachMessage: handleMessage});
}

let msgNumber = 0
const handleMessage = async ({ topic, partition, message }: EachMessagePayload) => {
    msgNumber++;
    console.log(`writing result to DB: ${msgNumber}, ${message.key}, ${message.value} ${message.timestamp}`);

    if (message.value == null)
    {
        console.warn(`Cannot proceed with null object`);
        return;
    }

    const request = JSON.parse(message.value.toString()) as WordChainEntry;

    var collection = await connectToDatabase();

    await update(request, collection);

    console.log(`done writing result in DB: ${message}`);
}

run().then(() => {
    console.log("run done");
}).catch(e =>
{
    console.error(e);
})
