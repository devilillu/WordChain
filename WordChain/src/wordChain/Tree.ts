import { exactlyOneDiff } from "../tools/stringTools";
import { StringDictionary } from "./algorithm";
import { WordChainInput } from "./io";
import { TreeNode } from "./TreeNode";

export class Tree {
    static Version = "v3";

    Root: TreeNode;
    ItemsToExpand: TreeNode[];
    private _usedNodesLookup: StringDictionary<TreeNode> = {}
    private _shortestSolutionDepth: number;

    constructor(root: TreeNode) {
        this.Root = root;
        this.ItemsToExpand = [root];
        this._shortestSolutionDepth = Number.POSITIVE_INFINITY;
    }

    get hasItems(): boolean {
        return this.ItemsToExpand.length > 0;
    }

    popAndProcessNext(input: WordChainInput): TreeNode[] {
        var curNode = this.ItemsToExpand.shift();

        if (curNode === undefined)// || curNode.Depth + 1 > this._shortestSolutionDepth)
            return [];

        var curNodeWord = curNode.Word;
        var newChildrenDepth = curNode.Depth + 1;

        var children = input.ioPool.filter((avail) => 
            this._usedNodesLookup[avail] == undefined && exactlyOneDiff(curNodeWord, avail));
        
        curNode.Children.push(...
            children.map(ch => 
                new TreeNode(curNode as TreeNode, newChildrenDepth, ch, input.ioPoolEndWordDiffCharCache[ch])
            ).sort((a, b) => a.CostToEnd > b.CostToEnd ? 0 : -1)
        );

        return this.onChildrenAdded(curNode.Children);
    }

    MarkCurrentDepthToFinish(depth: number) {
        if (this._shortestSolutionDepth === Number.POSITIVE_INFINITY)
            this._shortestSolutionDepth = depth;
    }

    private onChildrenAdded(nodes: TreeNode[]): TreeNode[] {
        var solutions: TreeNode[] = [];
        for (var newNode of nodes) {
            this.ItemsToExpand.push(newNode);
            if (newNode.isSolution) //provide solution
                solutions.push(newNode);
            else //don't add in used nodes lookup, so similar depth solution can be found
                this._usedNodesLookup[newNode.Word] = newNode;
        }
        return solutions;
    }
}
