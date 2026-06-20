/**
 * A single node in the tree consumed by `TreeManager.traverse` and `TreeViewer`.
 *
 * `path` is intended to be `/`-separated by convention, but no public API
 * method literally depends on `/` other than the default leaf labelling in
 * `TreeViewer` (consumers can override that via `renderLabel`).
 */
interface TreeNode {
  children?: TreeNode[];
  path: string;
  type: 'blob' | 'tree';
}

class TreeManager {
  public tree: TreeNode[];

  constructor(tree?: TreeNode[]) {
    this.tree = tree ?? [];
  }

  /**
   * Depth-first traversal of the tree.
   *
   * **Contract:** the callback is invoked on the parent *before* its
   * children, and the children are visited in their declaration order.
   * Roots are visited in declaration order. This ordering is part of the
   * stable API — downstream code (e.g. id-collection patterns) depends on
   * it.
   *
   * @param callback Function called once per node in DFS order.
   */
  public traverse(callback: (node: TreeNode) => void): void {
    const depthFirst = (node: TreeNode): void => {
      callback(node);

      if (node.children) {
        for (const child of node.children) {
          depthFirst(child);
        }
      }
    };

    for (const rootNode of this.tree) {
      depthFirst(rootNode);
    }
  }

  // NOTE: `add`, `delete`, and `move` are intentionally stubs in this
  // release. They only emit a console.log so library users can confirm the
  // call is wired up; they do not mutate the tree. Treat them as a
  // placeholder until a real implementation lands. See CHANGELOG.md for
  // the stability matrix.
  public add(node: TreeNode, tree: TreeNode[]): TreeNode[] | void {
    console.log('[TreeManager.add] (stub)', { path: node.path, tree });
  }

  public delete(type: 'blob' | 'tree', path: string): void {
    console.log('[TreeManager.delete] (stub):', { type, path });
  }

  public move(from: string, to: string): void {
    console.log('[TreeManager.move] (stub):', { from, to });
  }
}

export { TreeManager };

export type TreeManagerInstance = InstanceType<typeof TreeManager>;
export type { TreeNode };
