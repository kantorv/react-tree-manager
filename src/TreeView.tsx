import { useEffect } from 'react';
import { Box } from '@mui/material';
import { LocalFSProjectForm } from './widgets/catalogview/Main';

type TreeViewProps = {
  text?: string;
};

const TreeView = (props: TreeViewProps) => {
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
        <LocalFSProjectForm onClose={() => {}} />
      </Box>
    </Box>
  );
};

export { TreeView };
