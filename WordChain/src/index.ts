import { EachMessagePayload, Kafka } from "kafkajs";
import { wordChainApp } from "./app";
import { buildGroupedWordsList } from "./wordChain/dataLoader";
import { WordChainEntry, WordChainRequest } from "./common";

const kafkaEndPoint : string = process.env.KAFKA_ENDPOINT || "localhost:9092";
const reqTopic : string = process.env.KAFKA_REQUESTS_TOPIC || "topic-wordchain-request";
const resTopic : string = process.env.KAFKA_RESULTS_TOPIC || "topic-wordchain-result";
const kafkaReq = new Kafka({
    clientId: "wordchain-requests",
    brokers: [kafkaEndPoint],
});
const kafkaRes = new Kafka({
    clientId: "wordchain-results",
    brokers: [kafkaEndPoint],
});

const consumer = kafkaReq.consumer({ groupId: 'requests-consumer-group' })
const producer = kafkaRes.producer();
let msgNumber = 0

var groupedWordsList = buildGroupedWordsList('./dictionaries/TWL06.txt');

const run = async () => {
    await consumer.connect();
    await producer.connect();

    await consumer.subscribe({ topic: reqTopic, fromBeginning: false });
    await consumer.run({eachMessage: handleMessage});
}

const handleMessage = async ({ topic, partition, message }: EachMessagePayload) => {
    msgNumber++;
    console.log(`processing ${msgNumber}, ${message.key}, ${message.value} ${message.timestamp}`);

    if (message.value == null)
    {
        console.log(`Cannot proceed with null object ${message}`);
        return;
    }

    const request = JSON.parse(message.value.toString()) as WordChainRequest;
    var startWord :string = request.start;
    var endWord :string = request.end;
    var result = wordChainApp(startWord, endWord, groupedWordsList);   
    
    var name = `${startWord}_${endWord}`;
    var value = new WordChainEntry(); 
    value.name = name;
    value.start = startWord;
    value.end = endWord;
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

    await producer.send({
        topic: resTopic,
        messages: [{key: name, value: JSON.stringify(value)}]
    });

    console.log(`done with ${message}`);
}

run().then(() => {
    console.log("run done");
}).catch(e =>
{
    console.error(e);
})
