interface TreeNode {
  children?: TreeNode[];
  path: string;
  type: 'blob' | 'tree';
}

type TreeViewMode = 'flat' | 'wide' | 'compact';

type TreeSortOptions = 'name' | 'size' | 'path' | 'created';

type TreeUiSettings = {
  compact_tree: boolean;
  expanded: boolean;
  orderBy: TreeSortOptions;
  view_mode: TreeViewMode;
};

interface TreeContentItem {
  mode: string;
  path: string;
  sha: string;
  size?: number;
  type: 'blob' | 'tree';
  url: string;
}

export type {
  TreeNode,
  TreeSortOptions,
  TreeUiSettings,
  TreeViewMode,
  TreeContentItem,
};
