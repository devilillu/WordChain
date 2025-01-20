import { WordChainOutput, WordChainUserInput } from './wordChain/io';
import { AssertInput, buildInput } from './wordChain/dataLoader';
import { wordChain } from './wordChain/wordChain';
import { NumberDictionary } from './wordChain/algorithm';

export function wordChainApp(startWord: string, endWord: string, dictionary: NumberDictionary) : WordChainOutput | string{
    var userInput = new WordChainUserInput(startWord, endWord);
    try {
        AssertInput(userInput, dictionary);
        var output = wordChain(buildInput(userInput, dictionary), true);
        return output;
    } catch (e) {
        console.error(e);
        if (typeof e === "string")
            return e;
        else if (e instanceof Error)
            return e.message;
        else
            return "unknown exception";
    }
}
