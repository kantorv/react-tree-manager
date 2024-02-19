import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { green } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Paper, Box } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FolderSelector } from './FolderSelect';
import { type TreeNode } from '../../types/lib.types';

type AddAssetFormProps = {
  closeFn: () => void;
  folders: Array<string>;
  saveFn: (item: TreeNode) => void;
  selected: string;
  type: 'blob' | 'tree';
};

const AddAssetForm = (props: AddAssetFormProps) => {
  const { folders, type, saveFn, closeFn, selected } = props;
  const [name, setName] = useState<string>('');
  const [selectedFolder, setSelectedFolder] = useState<string>(
    selected.length ? selected : '/'
  );

  const onSaveClick = () =>
    saveFn({
      type,
      path: selectedFolder === '/' ? name : `${selectedFolder}/${name}`,
      ...(type === 'tree' && { children: [] }),
    });

  return (
    <Paper
      sx={{
        p: 1,
        m: 1,
      }}
      variant="outlined"
    >
      <List sx={{ p: 1, bgcolor: 'background.paper' }}>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="close" onClick={closeFn}>
              <CloseIcon />
            </IconButton>
          }
          disablePadding
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: green[500], width: 32, height: 32 }}>
              {type === 'blob' ? (
                <AssignmentIcon fontSize="small" />
              ) : type === 'tree' ? (
                <FolderIcon fontSize="small" />
              ) : null}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              type === 'blob'
                ? 'New file'
                : type === 'tree'
                  ? 'New folder'
                  : null
            }
            primaryTypographyProps={{
              variant: 'button',
            }}
          />
        </ListItem>
      </List>
      <Stack direction="column" spacing={0}>
        <Box
          sx={{
            p: 1,
          }}
        >
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            required
          />
        </Box>
        <Box
          sx={{
            p: 1,
          }}
        >
          <FolderSelector folders={folders} onSelect={setSelectedFolder} />
        </Box>
        <Box
          sx={{
            p: 1,
          }}
        >
          <Stack direction="row-reverse" spacing={2}>
            {/* <Button variant="outlined" color="error">Cancel</Button> */}
            <div
              style={{
                flexGrow: 1,
              }}
            />
            <Button
              disabled={name.length === 0}
              variant="outlined"
              onClick={onSaveClick}
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export { AddAssetForm };
