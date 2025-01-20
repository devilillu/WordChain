import { StringDictionary } from "./algorithm";
import { TreeNode } from "./TreeNode";

export class WordChainSolution {
    prettyPrint(): string {
        return this.Path.map(node => node.Word).join();
    }
    constructor(node: TreeNode) {
        this.Leaf = node;
    }

    Leaf: TreeNode;
    get Path(): TreeNode[] {
        if (this._path == undefined) {
            this._path = this.buildPath();
        }

        return this._path;
    }

    get depth(): number {
        if (this._path == undefined) {
            this._path = this.buildPath();
        }

        return this._path.length;
    }

    private _path: TreeNode[] | undefined = undefined;

    private buildPath(): TreeNode[] {
        if (this.Leaf.Parent == null)
            return [this.Leaf];
        else {
            var nodesPath: TreeNode[] = [this.Leaf];
            var node: TreeNode | null = this.Leaf.Parent;
            while (node != null) {
                nodesPath.push(node);
                node = node.Parent;
            };
            return nodesPath;
        }
    }
}

export class WordChainUserInput {
    StartWord: string;
    EndWord: string;

    constructor(startWord: string, endWord: string) {
        this.StartWord = startWord;
        this.EndWord = endWord;
    }
};

export type WordChainInput = {
    userInput: WordChainUserInput;
    ioPool: string[];
    ioPoolEndWordDiffCharCache: StringDictionary<number>;
};

export class WordChainOutput {
    Input: WordChainInput;
    Results: WordChainSolution[] = [];
    Error: string | undefined;
    Runtime: number = 0;

    constructor(input: WordChainInput) {
        this.Input = input;
    }

    addResult(node: TreeNode): void {
        this.Results.push(new WordChainSolution(node));
    }

    shortestSolutions(): WordChainSolution[] {
        var shortestDepth: number = Infinity;
        for (var result of this.Results)
            if (result.depth < shortestDepth)
                shortestDepth = result.depth;

        return this.Results.filter(res => res.depth == shortestDepth);
    }
};
