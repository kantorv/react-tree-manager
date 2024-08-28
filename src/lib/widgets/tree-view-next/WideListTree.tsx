import * as React from 'react';
import { List, ListSubheader, ListItemText, ListItemIcon, ListItemButton, Collapse } from '@mui/material'
import { ExpandMore, KeyboardArrowRight as KeyboardArrowRightIcon, Article as ArticleIcon, Folder as FolderIcon } from '@mui/icons-material'
import { uuidv4 } from './helpers/utils';

type WideRecursiveListProps = {
  folder: TreeNode[];
  expanded: boolean;
  setActiveDoc: (path: string) => void;
};




type TreeItemProps = {
  onClick: (path: string) => void,
  node: TreeNode,
  expanded: boolean
}


const TreeItem = (props: TreeItemProps) => {
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





type CollapsibleBlockProps = {
  children?: React.ReactNode;
  expanded: boolean;
  node: TreeNode;
};
const CollapsibleBlock = (props: CollapsibleBlockProps) => {
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
      <TreeItem  expanded={open} node={node} onClick={handleClick} />
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




type LeafItemProps = {
  onClick: (path: string) => void,
  node: TreeNode,
}


const LeafItem = (props: LeafItemProps) => {

  const { node, onClick } = props
  const path = node.path
  const itemText = path.split('/').pop()

  return (
    <ListItemButton divider onClick={() => onClick(path)}>
      <ListItemIcon>
        <ArticleIcon />
      </ListItemIcon>
      <ListItemText primary={itemText} />
    </ListItemButton>
  )
}




const WideRecursiveList = (props: WideRecursiveListProps) => {
  const { folder, setActiveDoc, expanded } = props;

  const _id = uuidv4();

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"

      // TODO: parametrize header display and text, may be as optional extrenal component
      // aria-labelledby={`nested-list-subheader-${_id}`}
      // subheader={
      //   <ListSubheader component="div" id={`nested-list-subheader-${_id}`}>
      //     Nested List Items
      //   </ListSubheader>
      // }
    >
      {folder.map((item) => (
        <React.Fragment key={uuidv4()}>
          {item.children?.length ? (
            <CollapsibleBlock
              node={item} // emtpty for typesafe, but normally should not appear
              expanded={expanded}
            >
              <WideRecursiveList
                folder={item.children}
                expanded={expanded}
                setActiveDoc={setActiveDoc}
              />
            </CollapsibleBlock>
          ) : (
            <LeafItem node={item} onClick={setActiveDoc} />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export { WideRecursiveList };
