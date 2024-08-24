import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import type { TreeViewMode, TreeNode }

import ArticleIcon from '@mui/icons-material/Article';
import FolderIcon from '@mui/icons-material/Folder';
import { type TreeNode } from '../../types/lib.types';

import { uuidv4 } from '../../helpers/utils';

type EditableTreeProps = {
  data: TreeNode[];
  expanded: boolean;
  selected: string;
  setActiveDoc: (path: string) => void;
  setSelected: (s: string) => void;
};

type CollapsibleBlockProps = {
  children?: React.ReactNode;
  expanded: boolean;
  path: string;
  selected: string;
  setSelected: (s: string) => void;
};
const CollapsibleBlock = ({
  children,
  path,
  expanded,
  selected,
  setSelected,
}: CollapsibleBlockProps) => {
  const [open, setOpen] = React.useState(expanded);
  const handleClick = () => {
    setOpen(!open);
    setSelected(path);
  };
  return (
    <>
      <ListItemButton
        onClick={handleClick}
        divider
        selected={path === selected}
      >
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={path.split('/').pop()} />
        {open ? (
          <ExpandMore fontSize="small" />
        ) : (
          <KeyboardArrowRightIcon fontSize="small" />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            pl: 1,
          }}
        >
          {children}
        </List>
      </Collapse>
    </>
  );
};

const EditableTree = (props: EditableTreeProps) => {
  const { data, setActiveDoc, expanded, selected, setSelected } = props;

 
  const _id = uuidv4();

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby={`nested-list-subheader-${_id}`}
      // subheader={
      //     <ListSubheader component="div" id={`nested-list-subheader-${_id}`}>
      //         Nested List Items
      //     </ListSubheader>
      // }
    >
      {data.map((item) => (
        <React.Fragment key={uuidv4()}>
          {item.type === 'tree' ? (
            <CollapsibleBlock
              path={item.path}
              expanded={expanded}
              selected={selected}
              setSelected={setSelected}
            >
              <EditableTree
                data={item.children ?? []}
                expanded={expanded}
                setActiveDoc={setActiveDoc}
                selected={selected}
                setSelected={setSelected}
              />
            </CollapsibleBlock>
          ) : (
            <ListItemButton
              divider
              onClick={() => setSelected(item.path)}
              selected={item.path === selected}
            >
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary={item.path.split('/').pop()} />
            </ListItemButton>
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export { EditableTree };
