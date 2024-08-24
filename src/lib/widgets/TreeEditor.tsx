import { useEffect } from 'react';
import { Box } from '@mui/material';
import { LocalFSProjectForm } from "./tree-view/widgets/editor/Main"

type TreeEditorProps = {
  text?: string;
};

const TreeEditor = (props: TreeEditorProps) => {
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

export { TreeEditor };
