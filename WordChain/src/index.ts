import { EachMessagePayload, Kafka } from "kafkajs";
import { wordChainApp } from "./app";
import { buildGroupedWordsList } from "./wordChain/dataLoader";
import { RequestStatus, WordChainEntry, WordChainRequest } from "./common";

const kafkaEndPoint : string = process.env.KAFKA_ENDPOINT || "localhost:9092";
const reqTopic : string = process.env.KAFKA_REQUESTS_TOPIC || "topic-wordchain-request";
const resTopic : string = process.env.KAFKA_RESULTS_TOPIC || "topic-wordchain-result";
const kafka = new Kafka({
    clientId: "wordchain-processor",
    brokers: [kafkaEndPoint],
});

const consumer = kafka.consumer({ groupId: 'requestsConsumerGroup' })
const producer = kafka.producer( );
let msgNumber = 0

var groupedWordsList = buildGroupedWordsList('./dictionaries/TWL06.txt');

const run = async () => {
    await producer.connect();

    await consumer.connect();
    await consumer.subscribe({ topic: reqTopic, fromBeginning: false });
    await consumer.run({eachMessage: handleMessage});
}

const handleMessage = async ({ topic, partition, message }: EachMessagePayload) => {
    msgNumber++;
    console.log(`processing ${msgNumber}, ${message.key}, ${message.value} ${message.timestamp}`);

    if (message.value == null)
    {
        console.warn(`Cannot proceed with null message/value`);
        return;
    }

    const request = JSON.parse(message.value.toString()) as WordChainRequest;
    var result = wordChainApp(request.start, request.end, groupedWordsList);   
    
    var value = new WordChainEntry(); 
    value.name = request.name;
    value.start = request.start;
    value.end = request.end;
    if (typeof result !== "string")
    {
        value.runtime = result.Runtime;
        value.solutions = result.Results.map((res) => res.prettyPrint());
        value.shortests = result.shortestSolutions().map((res) => res.prettyPrint());
        value.algorithm = "v2";
        value.error = result.Error;
    }
    else
        value.error = result;

    value.status = RequestStatus.Complete;
    await producer.send({
        topic: resTopic,
        messages: [{key: request.name, value: JSON.stringify(value)}]
    });

    console.log(`done with ${message}`);
}

run().then(() => {
    console.log("run done");
}).catch(e =>
{
    console.error(e);
})
