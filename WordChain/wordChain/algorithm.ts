import { TreeNode } from "./TreeNode";

export type StringDictionary<T> = {
    [Key: string]: T;
};

export type NumberDictionary = {
    [key: number]: string[];
};

export function anyParentOrSelf(startSearchNode: TreeNode, testWord: string): boolean {
    if (startSearchNode.Word == testWord)
        return true;

    var node: TreeNode | null = startSearchNode.Parent;
    while (node != null) {
        //console.debug(node.Word + ' <> ' + testNode.Word);
        if (node.Word == testWord)
            return true;

        node = node.Parent;
    }

    return false;
}