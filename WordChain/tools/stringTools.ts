export function differentCharacters(string1: string, string2: string): number {
    var diffCost: number = 0;

    for (let i = 0; i < string1.length; i++)
        if (string1.charAt(i) != string2.charAt(i))
            diffCost++;

    return diffCost;
}

export function exactlyOneDiff(string1: string, string2: string): boolean {
    var diffCost: number = 0;

    for (let i = 0; i < string1.length; i++)
        if (string1.charAt(i) != string2.charAt(i)) {
            diffCost++;
            if (diffCost > 1)
                return false;
        }

    return diffCost == 1;
}
