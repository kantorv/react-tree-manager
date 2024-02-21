import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FolderIcon from '@mui/icons-material/Folder';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import type { TreeViewMode } from '../../types/lib.types';

type TreeModeToggleProps = {
  mode: TreeViewMode;
  setMode: (mode: TreeViewMode) => void;
};

const TreeModeToggle = (props: TreeModeToggleProps) => {
  const { mode, setMode } = props;

  const handleMode = (
    event: React.MouseEvent<HTMLElement>,
    newMode: TreeViewMode
  ) => {
    if (newMode) setMode(newMode);
  };

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleMode}
      aria-label="explorer mode"
      size="small"
    >
      <ToggleButton value="flat" aria-label="left aligned" color="info">
        <FolderIcon />
      </ToggleButton>
      <ToggleButton value="wide" aria-label="right aligned" color="info">
        <FolderCopyIcon />
      </ToggleButton>

      <ToggleButton value="compact" aria-label="right aligned" color="info">
        <AccountTreeIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export { TreeModeToggle };
