import { EachMessagePayload, Kafka } from "kafkajs";
import { wordChainApp } from "./app";
import { buildGroupedWordsList } from "./wordChain/dataLoader";
import { WordChainOutput } from "./wordChain/io";

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

    await consumer.subscribe({ topic: reqTopic, fromBeginning: true });
    await consumer.run({eachMessage: handleMessage});
}

const handleMessage = async ({ topic, partition, message }: EachMessagePayload) => {
    msgNumber++;
    console.log(`processing ${msgNumber}, ${message.key}, ${message.value} ${message.timestamp}`);

    var result: WordChainOutput | string;
    if (message.value != null)
    {
        var startWord :string = message.value[0].toString();
        var endWord :string = message.value[1].toString();
        result = wordChainApp(startWord, endWord, groupedWordsList);   
        
        await producer.send({
            topic: resTopic,
            messages: [{key: startWord + "_" + endWord, value: resultToMessageObject(result)}]
        });
    }        

    console.log(`done with ${message}`);
}


run().then(() => {
    console.log("run done");
}).catch(e =>
{
    console.error(e);
})

function resultToMessageObject(result: string | WordChainOutput) : string {
    if (typeof result === "string")
        return result;
    else if (result == null)
        return "unknown status";
    else
        return result.shortestSolutions().map(sol => sol.prettyPrint()).join('\r\n');
}

