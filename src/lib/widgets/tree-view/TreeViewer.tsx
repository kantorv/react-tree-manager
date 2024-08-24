import * as React from 'react';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { TreeViewer } from   "./widgets/viewer/Main"

type TreeViewerProps = {
  text?: string;
};

const TreeViewerComponent = (props: TreeViewerProps) => {
  const { text } = props;

  useEffect(() => {
    console.log(text);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: 'wheat',
        height: '100%',
        maxWidth: 400,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',

          p: 1,
        }}
      >
        <TreeViewer />
      </Box>
    </Box>
  );
};

export { TreeViewerComponent };
