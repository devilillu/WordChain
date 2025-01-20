import { WordChainInput, WordChainOutput } from "./io";
import { differentCharacters } from "../tools/stringTools";
import { showMemory } from "../tools/showMemory";
import { TreeNode } from "./TreeNode";
import { Tree } from "./Tree";

export function wordChain(input: WordChainInput, print: boolean): WordChainOutput {
    const startTime = performance.now();
    var lastDebugTime = startTime;

    var output = new WordChainOutput(input);

    const tree = new Tree(new TreeNode(null, 0, input.userInput.StartWord,
        differentCharacters(input.userInput.StartWord, input.userInput.EndWord)));

    while (tree.hasItems) {
        var solutions = tree.popAndProcessNext(input);
        
        solutions.forEach((node) => { output.addResult(node) });

        if (process.env.KAFKA_ENDPOINT && performance.now() - lastDebugTime > 3000) {
            showMemory();
            console.log(`${input.ioPool.length} # of words working with..`);
            console.log(`Items left to expands and explore : ${tree.ItemsToExpand.length}`);
            console.log(`# of solutions found : ${output.Results.length}`);
            lastDebugTime = performance.now();
            console.log(`Time elapsed ${Math.round(performance.now() - startTime) / 1000} seconds`);
        }
    }

    if (print) {
        console.log();
        //for (var result of output.Results)
        //    console.log(result.prettyPrint());

        var shortestSolutions = output.shortestSolutions();
        console.log(`Total # of solutions found : ${output.Results.length}`);
        console.log(`Shorted # of solutions found : ${shortestSolutions.length}`);    
        console.log('Shortest solutions:');
        for (var result of output.shortestSolutions())
            console.log(result.prettyPrint());
    }

    output.Runtime = performance.now() - startTime;
    console.log(`Call to find solutions took ${output.Runtime} milliseconds`)
    return output;
}
