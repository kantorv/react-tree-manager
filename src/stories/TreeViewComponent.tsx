import * as React from 'react';
import { useEffect, useState } from 'react';
import {Box} from '@mui/material';

import { TreeManager } from '../lib/widgets/tree-view-next/helpers/treemgmt'
import { WideRecursiveList } from '../lib/widgets/tree-view-next/WideListTree';

type TreeViewComponentProps = {
    tree: TreeNode[];
};
  




 const TreeViewWrapper = (props:TreeViewComponentProps)=> {

  // const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const onSelect = (node: TreeNode) =>  console.log('TreeViewWrapper.onSelect called', node.path);
  const treeManager = new TreeManager(props.tree);


  useEffect(() => {
    console.log('[TreeViewWrapper.useEffect] tree updated', props.tree);
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
          component={'div'}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            whiteSpace:"wrap",
            p: 1,
          }}
        >
            <WideRecursiveList onSelect={onSelect} folder={props.tree} expanded={false} />
        </Box>
      </Box>
  )
  
 }

export {TreeViewWrapper}