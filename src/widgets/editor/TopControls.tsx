import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

import DeleteIcon from '@mui/icons-material/Delete';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { Divider, Box } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import { type TreeNode } from '../../types/lib.types';
import { AddAssetForm } from './AddAssetForm';

import { TreeManager } from '../../service/treemgmt';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

type TopControlsProps = {
  selected: string;
  tree: TreeNode[];
  // treemgmt: TreeManagerInstance,
  updateTreeFn: (tree: TreeNode[]) => void;
};

const TopControls = (props: TopControlsProps) => {
  const { updateTreeFn, tree, selected } = props;
  // const [treeType, setTreeType] = useState<TreeViewMode>("wide")

  const [editSection, setEditSection] = useState<'tree' | 'blob' | null>(null);

  const [folders, setFolders] = useState<string[]>([]);
  const tmgmt = new TreeManager();

  const [clipboard, setClipboard] = useState<string | null>(null);

  useEffect(() => {
    const treeFolders = tmgmt.get_folders(tree);
    setFolders(treeFolders);
    console.log('[TopControls] useEffect tree', tree);
  }, [tree]);

  const closeAddFormFn = () => setEditSection(null);

  const saveFn = (node: TreeNode) => {
    updateTreeFn([]);
    setTimeout(() => {
      const newTree = tmgmt.add(node, tree);
      // const normalized_tree = tmgmt.normalize_path(new_tree)
      updateTreeFn(newTree ?? tree);
      console.log('[TopControls] saveFn', node.path, newTree);
      closeAddFormFn();
    }, 0);
  };

  const onDeleteItem = () => {
    console.log('[TopControls] onDeleteItem', selected);
  };

  const onCutItem = () => {
    console.log('[TopControls] onCutItem', selected);
    if (selected) setClipboard(selected);
  };

  const onCopyItem = () => {
    console.log('[TopControls] onCopyItem', selected);
    if (selected) setClipboard(selected);
  };

  const onPasteItem = () => {
    console.log(`[TopControls] onPasteItem: ${clipboard}->${selected}`);
    setClipboard(null);
  };

  const onMoveUp = () => {
    console.log('[TopControls] onMoveUp', selected);
  };

  const onMoveDown = () => {
    console.log('[TopControls] onMoveDown', selected);
  };

  useEffect(() => {
    if (editSection !== null) return;
    const handleKeyDown = (event: any) => {
      event.preventDefault();
      const code = event.which || event.keyCode;

      const charCode = String.fromCharCode(code).toLowerCase();
      //     console.log("charCode", charCode)
      if ((event.ctrlKey || event.metaKey) && charCode === 'x') {
        console.log('CTRL+X Pressed');
        onCutItem();
      } else if ((event.ctrlKey || event.metaKey) && charCode === 'c') {
        console.log('CTRL+C Pressed');
        onCopyItem();
      } else if ((event.ctrlKey || event.metaKey) && charCode === 'v') {
        console.log('CTRL+V Pressed');
        onPasteItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    /* eslint-disable-next-line */
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editSection]);

  return (
    <Box>
      <DrawerHeader>
        <Stack direction="row" spacing={0}>
          <IconButton
            aria-label="add-file"
            onClick={() =>
              setEditSection(editSection === 'blob' ? null : 'blob')
            }
          >
            <PostAddIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem />

          <IconButton
            aria-label="add-floder"
            onClick={() =>
              setEditSection(editSection === 'tree' ? null : 'tree')
            }
          >
            <CreateNewFolderIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem />
        </Stack>
        <div
          style={{
            flexGrow: 1,
          }}
        />

        {selected || clipboard ? (
          <Stack direction="row" spacing={0} sx={{}}>
            {clipboard !== null ? (
              <>
                <IconButton aria-label="paste-file" onClick={onPasteItem}>
                  <ContentPasteGoIcon />
                </IconButton>
                <Divider orientation="vertical" flexItem />
              </>
            ) : null}

            <IconButton aria-label="copy-file" onClick={onCopyItem}>
              <ContentCopyIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />

            <IconButton aria-label="cut-file" onClick={onCutItem}>
              <ContentCutIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton aria-label="delete-file" onClick={onDeleteItem}>
              <DeleteIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <Divider orientation="vertical" flexItem />
            <IconButton aria-label="cut-file" onClick={onMoveUp}>
              <ArrowUpwardIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton aria-label="cut-file" onClick={onMoveDown}>
              <ArrowDownwardIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
          </Stack>
        ) : null}
        {/* <FileActionsToggleButtons mode={treeType} setMode={setTreeType} /> */}
      </DrawerHeader>

      <Collapse in={editSection === 'blob'} timeout="auto" unmountOnExit>
        <Divider />
        <AddAssetForm
          selected={selected}
          folders={folders}
          type="blob"
          saveFn={saveFn}
          closeFn={closeAddFormFn}
        />
      </Collapse>

      <Collapse in={editSection === 'tree'} timeout="auto" unmountOnExit>
        <Divider />
        <AddAssetForm
          selected={selected}
          folders={folders}
          type="tree"
          saveFn={saveFn}
          closeFn={closeAddFormFn}
        />
      </Collapse>
    </Box>
  );
};

export { TopControls };
