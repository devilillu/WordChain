import assert from "assert";
import { differentCharacters } from "../tools/stringTools";
import { NumberDictionary, StringDictionary } from "./algorithm";
import { WordChainUserInput, WordChainInput } from "./io";
import { readFileSync } from 'fs';

//Problem input definition and verification
//const unevenWordsInput: WordChainInput = { StartWord: 'cata', EndWord: 'lay' };
//const tooLongInput: WordChainInput = { StartWord: 'cataaaaaaaaaaaaaaa', EndWord: 'layaaaaaaaaaaaaaaa' };
//const unknowWords: WordChainInput = { StartWord: 'cat', EndWord: 'lay' };
//const input1: WordChainInput = { StartWord: 'BOMB', EndWord: 'LOAN' };
//const input1: WordChainInput = { StartWord: 'ABACTERIAL', EndWord: 'ABANDONERS' };

export function AssertInput(input: WordChainUserInput, groupedWordsList: NumberDictionary): void {
    const ioWordLength = input.StartWord.length;
    assert(input.StartWord.length == input.EndWord.length, 'Start and end word not of same length...');
    assert(ioWordLength in groupedWordsList, 'Not supported words length (won\'t exist in dictionary)');
    assert(groupedWordsList[ioWordLength].includes(input.StartWord), 'Start word not in dictionary (use capital letters only)');
    assert(groupedWordsList[ioWordLength].includes(input.EndWord), 'End word not in dictionary (use capital letters only)');
}

export function readFileIntoArraySync(filePath: string): string[] {
    const fileContent = readFileSync(filePath, 'utf8');
    const lines = fileContent.split(/\r?\n/);
    return lines;
}

export function buildGroupedWordsList(filename: string): NumberDictionary {
    //Load whole dictionary in flat string[]
    const wordsList = readFileIntoArraySync(filename);
    console.log(`${wordsList.length} total words loaded`);

    //Group dictionary by words length
    const groupedWordsList: NumberDictionary = [];
    for (var i = 0; i < wordsList.length; i++) {
        const wordLength = wordsList[i].length
        if (!(wordLength in groupedWordsList))
            groupedWordsList[wordLength] = [];

        groupedWordsList[wordLength].push(wordsList[i])
    }

    return groupedWordsList;
}

export function buildInput(userInput: WordChainUserInput, groupedWordsList: NumberDictionary): WordChainInput {
    const ioWordLength = userInput.StartWord.length;
    const ioPool: string[] = [];
    for (var word of groupedWordsList[ioWordLength])
        ioPool.push(word);

    console.log(`${ioPool.length} total ${ioWordLength} lettered words loaded`);

    ioPool.splice(ioPool.indexOf(userInput.StartWord), 1);

    const cache: StringDictionary<number> = {}
    for (var ioPoolWord of ioPool)
        cache[ioPoolWord] = differentCharacters(ioPoolWord, userInput.EndWord);

    var input: WordChainInput = { userInput: userInput, ioPool: ioPool, ioPoolEndWordDiffCharCache: cache }
    return input;
}