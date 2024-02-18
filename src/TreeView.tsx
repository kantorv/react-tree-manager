import React from 'react';
import { Box, Typography } from '@mui/material';
import { TreeRenderer } from './widgets/catalogview/Main';
import { TreeControlsBar } from './widgets/controls/Main';

type TreeViewProps = {
  text?: string;
};

const TreeView = (props: TreeViewProps) => {
  const { text } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: 'wheat',
        height: '100%',
      }}
    >
      <Typography variant="button" sx={{ flexGrow: 0 }}>
        TreeView :: {text}
      </Typography>
      <TreeControlsBar />
      <TreeRenderer />
    </Box>
  );
};

export { TreeView };
