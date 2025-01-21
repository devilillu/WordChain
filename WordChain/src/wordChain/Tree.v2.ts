import { exactlyOneDiff } from "../tools/stringTools";
import { StringDictionary, anyParentOrSelf } from "./algorithm";
import { WordChainInput } from "./io";
import { TreeNode } from "./TreeNode";

export class Tree {
    static Version = "v2";

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

    popAndProcessNext(input: WordChainInput): TreeNode[] {
        var curNode = this.ItemsToExpand.pop();

        if (curNode == undefined || this.AnyParentAbandoned(curNode))
            return [];

        for (var ioPoolWord of input.ioPool) {
            if (exactlyOneDiff(curNode.Word, ioPoolWord)) {
                var existingNode: TreeNode = this.NodesLookup[ioPoolWord];
                if (existingNode == undefined) //not in the tree, so add
                    Tree.addChildToNode(curNode, ioPoolWord, input.ioPoolEndWordDiffCharCache[ioPoolWord]);
                else if (existingNode.Depth > curNode.Depth + 1) { //worst
                    //this.replace(ioPoolWord);
                    //this.abandon(ioPoolWord);
                    existingNode.IsAbandoned = true;
                    Tree.addChildToNode(curNode, ioPoolWord, input.ioPoolEndWordDiffCharCache[ioPoolWord]);
                }
                else { //exists in better so don't expand
                }
            }
        }

        //curNode.sortChildren();

        curNode.IsExpanded = true;
        return this.onChildrenAdded(curNode.Children);
    }

    private onChildrenAdded(nodes: TreeNode[]): TreeNode[] {
        var solutions: TreeNode[] = [];
        for (var newNode of nodes) {
            this.ItemsToExpand.push(newNode);
            this.NodesLookup[newNode.Word] = newNode;
            if (newNode.isSolution)
                solutions.push(newNode);
        }
        return solutions;
    }

    private static addChildToNode(parentNode: TreeNode, newNodeWord: string, cost: number): void {
        const newNode = new TreeNode(parentNode, parentNode.Depth + 1, newNodeWord, cost);
        parentNode.Children.push(newNode);
    }

    AnyParentAbandoned(node: TreeNode | null): boolean {
        while (node != null) {
            if (node.IsAbandoned)
                return true;
            node = node.Parent;
        }

        return false;
    }

    private replace(newNodeWord: string): void {
        var debug: TreeNode[] = [];
        for (var item of this.ItemsToExpand) {
            if (anyParentOrSelf(item, newNodeWord))
                debug.push(item);
        }

        this.ItemsToExpand = this.ItemsToExpand.filter((tn) => !anyParentOrSelf(tn, newNodeWord));
    }

    private abandon(newNodeWord: string): void {
        for (var item of this.ItemsToExpand) {
            if (!item.IsAbandoned && anyParentOrSelf(item, newNodeWord))
                item.IsAbandoned = true;
        }
    }
}
