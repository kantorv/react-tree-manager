interface TreeNode {
    children?: TreeNode[];
    path: string;
    type: 'blob' | 'tree';
  }
  