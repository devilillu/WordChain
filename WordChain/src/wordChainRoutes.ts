import { Router, Request, Response } from "express";
import { buildGroupedWordsList } from "./wordChain/dataLoader";
import { wordChainApp } from "./app";

var groupedWordsList = buildGroupedWordsList('dictionaries/TWL06.txt');

const router = Router();

router.get("/:start/:end", (req: Request, res: Response) => {
    const startWord = req.params.start;
    const endWord = req.params.end;

    var result = wordChainApp(startWord, endWord, groupedWordsList);

    if (typeof result === "string")
        res.status(404).json({ message: result });
    else
        res.json(result.shortestSolutions().map(sol => sol.prettyPrint()));
  });

  export default router;