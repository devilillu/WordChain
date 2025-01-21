import { exactlyOneDiff } from "../tools/stringTools";
import { StringDictionary, anyParentOrSelf } from "./algorithm";
import { WordChainInput } from "./io";
import { TreeNode } from "./TreeNode";

export class Tree {
    static Version = "v1";

    Root: TreeNode;
    ItemsToExpand: TreeNode[];
    NodesLookup: StringDictionary<TreeNode> = {}

    constructor(root: TreeNode) {
        this.Root = root;
        this.ItemsToExpand = [root];
    }

    get hasItems(): boolean {
        return this.ItemsToExpand.length > 0;
    }

    onNodeChildrenRefreshed(node: TreeNode): TreeNode[] {
        var solutions: TreeNode[] = [];
        for (var child of node.Children) {
            this.ItemsToExpand.push(child);
            this.NodesLookup[child.Word] = child;
            if (child.isSolution)
                solutions.push(child);
        }
        return solutions;
    }

    popAndProcessNext(input: WordChainInput): TreeNode[] {
        var curNode = this.ItemsToExpand.pop();

        if (curNode == undefined)
            return [];

        for (var ioPoolWord of input.ioPool) {
            if (exactlyOneDiff(curNode.Word, ioPoolWord)) {
                switch (this.existingNodeDepthPosition(curNode.Depth + 1, ioPoolWord)) {
                    case ExistingNodePosition.Better:
                        break; //no need to add, existing node is in better place
                    case ExistingNodePosition.Worst:
                        this.replace(curNode, ioPoolWord, input.ioPoolEndWordDiffCharCache[ioPoolWord]);
                        break; //new node in better place
                    case ExistingNodePosition.None:
                        this.addChildToNode(curNode, ioPoolWord, input.ioPoolEndWordDiffCharCache[ioPoolWord]);
                        break; //none found, so add anyway
                }
            }
        }

        //curNode.sortChildren();

        return this.onNodeChildrenRefreshed(curNode);
    }

    existingNodeDepthPosition(nodeDepth: number, candidate: string): ExistingNodePosition {
        var existingNode: TreeNode = this.NodesLookup[candidate];
        if (existingNode == undefined)
            return ExistingNodePosition.None;
        else if (existingNode.Depth <= nodeDepth)
            return ExistingNodePosition.Better;
        else
            return ExistingNodePosition.Worst;
    }

    addChildToNode(parentNode: TreeNode, newNodeWord: string, cost: number): void {
        const newNode = new TreeNode(parentNode, parentNode.Depth + 1, newNodeWord, cost);
        parentNode.Children.push(newNode);
    }

    replace(parentNode: TreeNode, newNodeWord: string, cost: number): void {
        var debug: TreeNode[] = [];
        for (var item of this.ItemsToExpand) {
            if (anyParentOrSelf(item, newNodeWord))
                debug.push(item);
        }

        this.ItemsToExpand = this.ItemsToExpand.filter((tn) => !anyParentOrSelf(tn, newNodeWord));

        this.addChildToNode(parentNode, newNodeWord, cost);
    }
}

enum ExistingNodePosition {
    Better,
    Worst,
    None
}