import * as React from 'react';
import {Box} from '@mui/material';


type TreeViewComponentProps = {
    tree: TreeNode[];
};
  


 const TreeViewComponent = (props:TreeViewComponentProps)=> (
	<Box
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
      { JSON.stringify(props.tree)}
      </Box>
    </Box>
)


export {TreeViewComponent}