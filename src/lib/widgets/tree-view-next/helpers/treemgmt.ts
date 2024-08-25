

function traverseTree(nodes: TreeNode[]): void {
  // const nodes: TreeNode[] = [tree];
  let currentNode: TreeNode | undefined;

  while ((currentNode = nodes.pop())) {
    console.log(
      `[TreeManager.traverseTree] ${currentNode.type} -- ${currentNode.path}`
    ); // Process current node
    // if (currentNode.type === 'blob') console.log(currentNode.path)
    for (const child of currentNode.children || []) {
      nodes.unshift(child);
    }
  }
}

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

  // Methods (encapsulate behavior)
  public traverse(): void {
    traverseTree(this.tree);
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






//####### ############ sample data

const sample = [
  {
    type: 'blob',
    path: '/md/markdown-sample-ghview.md',
  },
  {
    type: 'tree',
    path: 'somefolder',
    children: [
      {
        type: 'blob',
        path: '/md/sample.md',
      },
      {
        type: 'blob',
        path: '/md/highlight.js.md',
      },
      {
        type: 'tree',
        path: 'test665',
        children: [
          {
            type: 'blob',
            path: '/md/tf-helm-index.html.markdown',
          },
          {
            type: 'blob',
            path: 'https://raw.githubusercontent.com/bevacqua/es6/master/readme.markdown',
          },
          {
            type: 'tree',
            path: 'yooo66',
            children: [
              {
                type: 'blob',
                path: '/md/highlight5.js.md',
              },
              {
                type: 'blob',
                path: '/md/sample7.md',
              },
              {
                type: 'blob',
                path: '/md/highlight6.js.md',
              },
            ],
          },
          {
            type: 'blob',
            path: '/md/highlight2.js.md',
          },
          {
            type: 'blob',
            path: '/md/sample2.md',
          },
          {
            type: 'blob',
            path: '/md/highlight3.js.md',
          },
        ],
      },
    ],
  },
  {
    type: 'tree',
    path: 'otherfolder',
    children: [
      {
        type: 'blob',
        path: '/md/tf-helm-index.html.markdown',
      },
      {
        type: 'blob',
        path: 'https://raw.githubusercontent.com/bevacqua/es6/master/readme.markdown',
      },
    ],
  },
  {
    type: 'tree',
    path: 'folder5',
    children: [
      {
        type: 'blob',
        path: '/md/sample2.md',
      },

      {
        type: 'blob',
        path: '/md/sample5.md',
      },
      {
        type: 'blob',
        path: '/md/highlight5.js.md',
      },
      {
        type: 'tree',
        path: 'folder10',
        children: [
          {
            type: 'blob',
            path: '/md/tf-helm-index.html.markdown',
          },
          {
            type: 'blob',
            path: 'https://raw.githubusercontent.com/bevacqua/es6/master/readme.markdown',
          },
          {
            type: 'tree',
            path: 'hello55',
            children: [
              {
                type: 'blob',
                path: '/md/highlight5.js.md',
              },
              {
                type: 'blob',
                path: '/md/sample7.md',
              },
              {
                type: 'blob',
                path: '/md/highlight6.js.md',
              },
            ],
          },
          {
            type: 'blob',
            path: '/md/highlight2.js.md',
          },
          {
            type: 'blob',
            path: '/md/sample2.md',
          },
          {
            type: 'blob',
            path: '/md/highlight3.js.md',
          },
        ],
      },
    ],
  },
];

const sample2 = [
  {
    type: 'blob',
    path: '/md/markdown-sample-ghview.md',
  },
  {
    type: 'tree',
    path: 'somefolder',
    children: [
      {
        type: 'blob',
        path: '/md/sample.md',
      },
      {
        type: 'blob',
        path: '/md/highlight.js.md',
      },
    ],
  },
  {
    type: 'tree',
    path: 'otherfolder',
    children: [
      {
        type: 'blob',
        path: '/md/tf-helm-index.html.markdown',
      },
      {
        type: 'tree',
        path: 'inner',
        children: [
          {
            type: 'blob',
            path: 'somefile.markdown',
          },
        ],
      },
    ],
  },
];

const sample3: TreeNode[] = [
  {
    type: 'blob',
    path: 'q.md',
  },
  {
    type: 'tree',
    path: 'a',
    children: [
      {
        type: 'blob',
        path: 'a/h.md',
      },
      {
        type: 'tree',
        path: 'a/b',
        children: [
          {
            type: 'blob',
            path: 'a/b/k.md',
          },
          {
            type: 'tree',
            path: 'a/b/c',
            children: [
              {
                type: 'blob',
                path: 'a/b/c/y.md',
              },
            ],
          },
        ],
      },
    ],
  },
];



export {sample as treedatasample, sample2 as treedatasample2, sample3 as treedatasample3 }