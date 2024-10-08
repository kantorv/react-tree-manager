export { WideRecursiveList as TreeViewer } from './lib/widgets/tree-view-next/WideListTree'
export { TreeManager, type TreeManagerInstance } from './lib/widgets/tree-view-next/helpers/treemgmt'

export interface TreeNode {
    children?: TreeNode[];
    path: string;
    type: 'blob' | 'tree';
  }
  