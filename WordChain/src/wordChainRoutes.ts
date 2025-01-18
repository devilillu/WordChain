import { Router, Request, Response } from "express";
import { buildGroupedWordsList } from "./wordChain/dataLoader";
import { wordChainApp } from "./app";

// import { Kafka } from "kafkajs";
// exports.kafka = new Kafka({
//     clientId: "wordchain-requests",
//     brokers: ["kafka1:9092"],
//   });
// const producer = exports.kafka.producer();


var groupedWordsList = buildGroupedWordsList('./dictionaries/TWL06.txt');

const router = Router();

router.get("/:start/:end", async (req: Request, res: Response) => {
    const startWord = req.params.start;
    const endWord = req.params.end;

    // await producer.connect();
    // await producer.send({
    //     topic: 'new-chainword-request',
    //     messages: [{key: startWord + endWord, value: startWord + endWord}],
    //     headers: {
    //         'start-word' : startWord,
    //         'end-word' : endWord
    //     }
    // });


    var result = wordChainApp(startWord, endWord, groupedWordsList);

    if (typeof result === "string")
        res.status(404).json({ message: result });
    else
        res.json(result.shortestSolutions().map(sol => sol.prettyPrint()));
  });

  export default router;