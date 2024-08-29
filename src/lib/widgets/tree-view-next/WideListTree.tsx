import * as React from 'react';
import { List, ListSubheader, ListItemText, ListItemIcon, ListItemButton, Collapse } from '@mui/material'
import { ExpandMore, KeyboardArrowRight as KeyboardArrowRightIcon, Article as ArticleIcon, Folder as FolderIcon } from '@mui/icons-material'
import { uuidv4 } from './helpers/utils';

type LeafItemProps = {
  onSelect: (node: TreeNode) => void, // TODO: check if node_id is better
  node: TreeNode,
}


const LeafItem = (props: LeafItemProps) => {
  const { node, onSelect } = props
  const path = node.path
  const itemText = path.split('/').pop()

  return (
    <ListItemButton divider onClick={() => onSelect(node)}> 
      <ListItemIcon>
        <ArticleIcon />
      </ListItemIcon>
      <ListItemText primary={itemText} />
    </ListItemButton>
  )
}

type ExpandableItemTextProps = {
  onClick: (path: string) => void,
  node: TreeNode,
  expanded: boolean
}

const ExpandableItemText = (props: ExpandableItemTextProps) => {
  const { node, onClick, expanded } = props
  const text = node.path.split('/').pop() || 'empty'
  return (
    <ListItemButton onClick={() => onClick(node.path)} divider>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText primary={text} />
      {expanded ? (
        <ExpandMore fontSize="small" />
      ) : (
        <KeyboardArrowRightIcon fontSize="small" />
      )}
    </ListItemButton>
  )
}


type TreeItemProps = {
  children?: React.ReactNode;
  expanded: boolean;
  node: TreeNode;
};
const TreeItem = (props: TreeItemProps) => {
  const {
    children,
    node,
    expanded,
  } = props
  
  const [open, setOpen] = React.useState(expanded);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ExpandableItemText  expanded={open} node={node} onClick={handleClick} />
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


type WideRecursiveListProps = {
  folder: TreeNode[];
  expanded: boolean;
  onSelect: (node: TreeNode) => void;
}; 


const WideRecursiveList = (props: WideRecursiveListProps) => {
  const { folder, onSelect, expanded } = props;

  //const _id = uuidv4();

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"

      // TODO: add header display (true/false) and/or text, may be as optional extrenal component
      // aria-labelledby={`nested-list-subheader-${_id}`}
      // subheader={
      //   <ListSubheader component="div" id={`nested-list-subheader-${_id}`}>
      //     Nested List Items
      //   </ListSubheader>
      // }
    >
      {folder.map((node) => (
        <React.Fragment key={uuidv4()}>
          {node.children?.length ? (
            <TreeItem
              node={node} // emtpty for typesafe, but normally should not appear
              expanded={expanded}
            >
              <WideRecursiveList
                folder={node.children}
                expanded={expanded}
                onSelect={onSelect}
              />
            </TreeItem>
          ) : (
            <LeafItem node={node} onSelect={onSelect} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export { WideRecursiveList };
