import { StringDictionary } from "./algorithm";

export class TreeNode {
    Parent: TreeNode | null;
    Children: TreeNode[] = [];
    Depth: number;
    Word: string;
    CostToEnd: number;
    IsExpanded: boolean = false;
    IsAbandoned: boolean = false;
    private _path: StringDictionary<string> | undefined;

    constructor(parent: TreeNode | null, depth: number, word: string, costToEnd: number) {
        this.Parent = parent;
        this.Depth = depth;
        this.Word = word;
        this.CostToEnd = costToEnd;
    }

    get isSolution(): boolean {
        return this.CostToEnd == 0;
    }

    path(): StringDictionary<string> {
        if (this._path == undefined) {
            var path: StringDictionary<string> = {};

            path[this.Word] = this.Word;
            var node = this.Parent;
            while (node != null) {
                path[node.Word] = node.Word;
                node = node.Parent;
            }

            this._path = path;
        }

        return this._path;
    }
}