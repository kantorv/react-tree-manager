import * as React from 'react';
import { useEffect, useState } from 'react';
import {Box} from '@mui/material';

import { TreeManager , treedatasample3} from './helpers/treemgmt'
import { WideRecursiveList } from './WideListTree';

type TreeViewComponentProps = {
    tree: TreeNode[];
};
  


 const TreeViewComponent = (props:TreeViewComponentProps)=> {

  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const setActiveDoc = (path: string) =>
    console.log('LocalFSProjectForm.setActiveDoc called', path);
  const tmgmt = new TreeManager([]);

  const updateTree = (tree: TreeNode[]): void => {
    const normalized_tree = tmgmt.normalize_path(tree);
    // tmgmt.traverse()
    setTreeData(normalized_tree);
  };

  useEffect(() => {
    updateTree(treedatasample3);
  }, []);

  useEffect(() => {
    console.log('[LocalFSProjectForm.useEffect] tree updated', treeData);
  }, [treeData]);


  return  (
    <Box
       data-testid="tree-component-wrapper"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          background: 'wheat',
          height: '100%',
          maxWidth: 400,
      minHeight: 800,
        }}
      >
        <Box
          component={'pre'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
              whiteSpace:"wrap",
            p: 1,
          }}
        >
         <WideRecursiveList setActiveDoc={setActiveDoc} data={props.tree} expanded />
        </Box>
      </Box>
  )
  
 }
  
  
  
 

export {TreeViewComponent}