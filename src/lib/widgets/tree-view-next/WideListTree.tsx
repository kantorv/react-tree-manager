import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArticleIcon from '@mui/icons-material/Article';
import FolderIcon from '@mui/icons-material/Folder';
import { uuidv4 } from './helpers/utils';

type WideRecursiveListProps = {
  data: TreeNode[];
  expanded: boolean;
  setActiveDoc: (path: string) => void;
};

// const ItemButton = ({ text }: { text: string }) => (
//   <ListItemButton divider>
//     <ListItemIcon>
//       <ArticleIcon />
//     </ListItemIcon>
//     <ListItemText primary={text} />
//   </ListItemButton>
// );

type CollapsibleBlockProps = {
  children?: React.ReactNode;
  expanded: boolean;
  text: string;
};


const CollapsibleBlock = ({
  children,
  text,
  expanded,
}: CollapsibleBlockProps) => {
  const [open, setOpen] = React.useState(expanded);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItemButton onClick={handleClick} divider>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={text} />
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

const WideRecursiveList = (props: WideRecursiveListProps) => {
  const { data, setActiveDoc, expanded } = props;

  // const _id = uuidv4();

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      // aria-labelledby={`nested-list-subheader-${_id}`}
      // subheader={
      //     <ListSubheader component="div" id={`nested-list-subheader-${_id}`}>
      //         Nested List Items
      //     </ListSubheader>
      // }
    >
      {data.map((item) => (
        <React.Fragment key={uuidv4()}>
          {item.children?.length ? (
            <CollapsibleBlock
              text={item.path.split('/').pop() || 'empty'}
              expanded={expanded}
            >
              <WideRecursiveList
                data={item.children}
                expanded={expanded}
                setActiveDoc={setActiveDoc}
              />
            </CollapsibleBlock>
          ) : (
            <ListItemButton divider onClick={() => setActiveDoc(item.path)}>
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

export { WideRecursiveList };
