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

        if (performance.now() - lastDebugTime > 3000) {
            console.clear();
            console.log(`${input.ioPool.length} total words working with..`);
            showMemory();
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

    console.log(`Call to find solutions took ${performance.now() - startTime} milliseconds`)

    return output;
}
