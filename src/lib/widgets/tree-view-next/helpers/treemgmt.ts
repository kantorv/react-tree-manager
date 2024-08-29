class TreeManager {
  // Properties (define with clear types)

  public tree: TreeNode[];

  // Constructor (initialize properties)
  constructor(tree?: TreeNode[]) {
    //  console.log("[TreeManager.constructor] started: input:", JSON.stringify(tree))
    this.tree = tree ?? [];
  }



  /**
    * Depth-first traversal of the tree.
    * @param callback Function to be called on each node.
    */
  public traverse(callback: (node: TreeNode) => void): void {
    const depthFirst = (node: TreeNode): void => {
      // Execute the callback on the current node
      callback(node);

      // Recursively traverse the children if they exist
      if (node.children) {
        for (const child of node.children) {
          depthFirst(child);
        }
      }
    };

    // Start traversal from each root node in the tree
    for (const rootNode of this.tree) {
      depthFirst(rootNode);
    }
  }



  public add(node: TreeNode, tree: TreeNode[]): TreeNode[] | void {
    console.log('[TreeManager.add]', node.path, parent, tree);
  }

  public delete(type: 'blob' | 'tree', path: string): void {
    console.log('[TreeManager.delete]:', { type, path });
  }

  public move(from: string, to: string): void {
    console.log('[TreeManager.move]:', { from, to });
  }


}

export { TreeManager };

// https://zirkelc.dev/posts/extract-class-methods
type ExtractInstanceType<T> = T extends new (...args: any[]) => infer R
  ? R
  : T extends { prototype: infer P }
  ? P
  : any;
type TreeManagerInstance = ExtractInstanceType<typeof TreeManager>;

export type { TreeManagerInstance };