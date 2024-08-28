function getFolders(
  nodes: TreeNode[],
  parent_path: string = '',
  output: string[] = []
): string[] {
  console.log('[getFolders] started', parent_path);
  // const nodes: TreeNode[] = [tree];
  for (const node of nodes) {
    if (node.children) {
      const normalized_path = node.path.split('/').pop() || '';
      const full_path = parent_path
        ? `${parent_path}/${normalized_path}`
        : normalized_path;
      output.push(full_path);
      console.log('[getFolders]node has children', full_path);
      getFolders(node.children, full_path, output);
    }
  }

  return output;
}

function normalizePath(
  nodes: TreeNode[],
  parent_path: string = ''
): TreeNode[] {
  console.log('[getFolders] started', parent_path);
  // const nodes: TreeNode[] = [tree];
  for (const node of nodes) {
    const normalized_path = node.path.split('/').pop() || '';
    const full_path = parent_path
      ? `${parent_path}/${normalized_path}`
      : normalized_path;
    node.path = full_path;

    if (node.children) {
      // console.log("[normalizePath]node has children",full_path)
      normalizePath(node.children, full_path);
    }
  }

  return nodes;
}

function findNodeRecursive(
  tree: TreeNode[],
  path: string
): TreeNode | undefined {
  for (const node of tree) {
    if (node.path === path) {
      return node;
    }
    if (node.children) {
      const foundNode = findNodeRecursive(node.children, path);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return undefined;
}

function appendNodeRecursive(
  tree: TreeNode[],
  node: TreeNode
): TreeNode[] | undefined {
  const parent_path = node.path.substring(0, node.path.lastIndexOf('/'));
  for (const node of tree) {
    if (node.path === parent_path) {
      // if(! ("children" in node) ) node.children = []
      node.children = [...node.children!, node];
      // node.children
      return tree;
    }
    if (node.children) {
      const _tree = appendNodeRecursive(tree, node);
      if (_tree) {
        return _tree;
      }
    }
  }
  return undefined;
}

function findNode(tree: TreeNode[], path: string): TreeNode | undefined {
  const pathParts = path.split('/');

  let currentNode: TreeNode | undefined;
  for (const part of pathParts) {
    if (currentNode === undefined) {
      currentNode = tree.find((node) => node.path === part);
    } else if (currentNode.children) {
      currentNode = currentNode.children.find(
        (node) => node.path === `${currentNode?.path}/${part}`
      );
    } else {
      return undefined;
    }

    if (!currentNode) {
      return undefined;
    }
  }

  return currentNode;
}

function findNodeReduce(tree: TreeNode[], path: string): TreeNode | undefined {
  // Split the path into parts
  const pathParts = path.split('/');

  // Use Array.reduce to iterate over the path parts and find the node
  return pathParts.reduce(
    (currentNode: TreeNode | undefined, part: string) =>
      // If no currentNode, find in the top-level tree
      !currentNode
        ? tree.find((node) => node.path === part)
        : // If currentNode has children, find in its children
        currentNode.children
          ? currentNode.children.find(
            (node) => node.path === `${currentNode.path}/${part}`
          )
          : // If currentNode has no children, return undefined
          undefined,
    undefined
  );
}

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



  public get_folders(tree: TreeNode[]): string[] {
    return getFolders(tree) || [];
  }

  public normalize_path(tree: TreeNode[]): TreeNode[] {
    return normalizePath(tree);
  }

  public add(node: TreeNode, tree: TreeNode[]): TreeNode[] | undefined {
    const parent_path = node.path.substring(0, node.path.lastIndexOf('/'));
    if (!parent_path.length) {
      tree.unshift(node);
      return tree;
    }

    console.log('[TreeManager.add]', node, parent_path);
    const parent = findNodeReduce(tree, parent_path);
    // const _tree = appendNodeRecursive(tree, node)
    if (undefined === parent || undefined === parent.children) return undefined;

    parent.children.push(node);
    console.log('[TreeManager.add]', node.path, parent, tree);
    // this.tree.push(node)
    return tree;
  }

  public delete(type: 'blob' | 'tree', path: string): void {
    console.log('[TreeManager.delete]:', { type, path });
  }

  public move(from: string, to: string): void {
    console.log('[TreeManager.move]:', { from, to });
  }

  public getTree(): TreeNode[] {
    return this.tree;
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