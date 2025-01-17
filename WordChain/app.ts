import { WordChainUserInput } from './wordChain/io';
import { buildGroupedWordsList, AssertInput, buildInput } from './wordChain/dataLoader';
import { wordChain } from './wordChain/wordChain';

try {
    var groupedWordsList = buildGroupedWordsList('dictionaries/TWL06.txt');

    var userInput = new WordChainUserInput('AMPHIBIAN', 'ABANDONED');
    AssertInput(userInput, groupedWordsList);
    var output = wordChain(buildInput(userInput, groupedWordsList), true);

    var userInput = new WordChainUserInput('HOPE', 'MANE');
    AssertInput(userInput, groupedWordsList);
    var output = wordChain(buildInput(userInput, groupedWordsList), true);


    var userInput = new WordChainUserInput('LANE', 'PAIN');
    AssertInput(userInput, groupedWordsList);
    var output = wordChain(buildInput(userInput, groupedWordsList), true);

    var userInput = new WordChainUserInput('PAIN', 'LANE');
    AssertInput(userInput, groupedWordsList);
    var output = wordChain(buildInput(userInput, groupedWordsList), true);

    debugger
} catch (err) {
    console.error(err);
    debugger
}
