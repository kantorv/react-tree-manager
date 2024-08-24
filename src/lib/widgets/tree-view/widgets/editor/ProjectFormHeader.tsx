import * as React from 'react';
import CardHeader from '@mui/material/CardHeader';
import FolderIcon from '@mui/icons-material/Folder';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import { blueGrey } from '@mui/material/colors';
import LabelIcon from '@mui/icons-material/Label';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography } from '@mui/material';

import FolderOpenIcon from '@mui/icons-material/FolderOpen';

type RepoSubheaderIconsProps = {
  path: string | undefined;
  tree: string | undefined;
};
export const RepoSubheaderIcons = (props: RepoSubheaderIconsProps) => {
  const { tree, path } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'start',
      }}
    >
      <Box sx={{ display: 'flex', pr: 1 }}>
        <LabelIcon fontSize="small" />
        <Typography variant="subtitle2">{tree || 'default'}</Typography>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <FolderOpenIcon fontSize="small" />
        <Typography variant="subtitle2">{path || '/'}</Typography>
      </Box>
    </Box>
  );
};

type ProjectFormHeaderProps = {
  // svc: RepoMachineActorRef,
  onClose: () => void;
};
const ProjectFormHeader = (props: ProjectFormHeaderProps) => {
  const { onClose } = props;

  // const { full_name, pushed_at } = repo_details

  return (
    <CardHeader
      sx={{
        width: '100%',
        // py: 0
      }}
      avatar={
        <Avatar sx={{ bgcolor: blueGrey[500] }}>
          <FolderIcon />
        </Avatar>
      }
      action={
        <IconButton aria-label="settings" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      }
      title="New Project"
      subheader={<RepoSubheaderIcons tree="default" path="/" />}
      titleTypographyProps={{
        variant: 'button',
      }}
      subheaderTypographyProps={{
        variant: 'body1',
        component: 'div',
      }}
    />
  );
};

export { ProjectFormHeader };
