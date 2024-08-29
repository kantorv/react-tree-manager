import * as React from 'react';
import { useEffect, useState } from 'react';
import {Box} from '@mui/material';

import { TreeManager } from './helpers/treemgmt'
import { WideRecursiveList } from './WideListTree';

type TreeViewComponentProps = {
    tree: TreeNode[];
};
  




 const TreeViewComponent = (props:TreeViewComponentProps)=> {

  // const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const setActiveDoc = (path: string) =>  console.log('LocalFSProjectForm.setActiveDoc called', path);
  const treeManager = new TreeManager(props.tree);


  useEffect(() => {
    console.log('[TreeViewComponent.useEffect] tree updated', props.tree);
    let cnt = 0;
    treeManager.traverse((node) => {
      console.log(`[TreeManager.traverse][${cnt+=1}] ${node.type} -- ${node.path}`);
    });

  }, [props.tree]);


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
            <WideRecursiveList onSelect={setActiveDoc} folder={props.tree} expanded />
        </Box>
      </Box>
  )
  
 }

export {TreeViewComponent}