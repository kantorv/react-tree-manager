import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import Divider from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { TreeNode } from '../../types/lib.types';
import { uuidv4 } from '../../helpers/utils';

type RecursiveExpandableListItemProps = {
  children: React.ReactNode;
  depth: number;
  expanded: boolean;
  primary: string;
  secondary?: string;
};

const RecursiveExpandableListItem = (
  props: RecursiveExpandableListItemProps
) => {
  const { children, depth, primary, secondary, expanded } = props;

  const [open, setOpen] = React.useState(expanded);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        divider={false}
        sx={{
          p: 0,
          pl: 2 * depth,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            pr: 1,
          }}
        >
          {/* <FolderOpenIcon fontSize="small" /> */}
          {open ? (
            <ExpandMore fontSize="small" />
          ) : (
            <KeyboardArrowRightIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={primary}
          secondary={secondary || null}
          sx={{ whiteSpace: 'nowrap', maxWidth: '100%' }}
          primaryTypographyProps={{
            variant: 'body2',
          }}
        />
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* <ListSubheader component="div">
            Inner {name} Items
          </ListSubheader> */}
          {children}
        </List>
      </Collapse>
    </>
  );
};

const RecursivePPTreeList = (props: {
  data: TreeNode[];
  depth?: number;
  expanded: boolean;
  setActiveDoc: (path: string) => void;
}) => {
  const { data, expanded, depth = 0, setActiveDoc } = props;

  //  data.sort((a,b)=>a.type === 'blob'?-1:1)
  return (
    <>
      {data.map((item) => (
        <React.Fragment key={uuidv4()}>
          {item.children?.length ? (
            <RecursiveExpandableListItem
              primary={item.path.split('/').pop() || 'empty'}
              // secondary={item.path}
              depth={depth}
              expanded={expanded}
            >
              <RecursivePPTreeList
                depth={depth + 1}
                data={item.children}
                expanded={expanded}
                setActiveDoc={setActiveDoc}
              />
            </RecursiveExpandableListItem>
          ) : (
            <ListItemButton
              onClick={() => setActiveDoc(item.path)}
              sx={{
                p: 0,
                pl: 2 * depth,
              }}

              //   divider={true}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  pr: 1,
                }}
              >
                {/* <KeyboardArrowRightIcon fontSize="small" /> */}
                {/* <ArticleIcon  fontSize="small" /> */}
              </ListItemIcon>
              <ListItemText
                primary={item.path.split('/').pop() || 'empty'}
                //  secondary={item.path}
                sx={{
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                  cursor: 'pointer',
                }}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontSize: 'small',
                  sx: {
                    ':hover': {
                      textDecoration: 'underline',
                    },
                  },
                }}
              />
            </ListItemButton>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

type GithubCatalogTreeViewProps = {
  data: TreeNode[];
  expanded: boolean;
  setActiveDoc: (path: string) => void;
};

const GithubCatalogTreeView = (props: GithubCatalogTreeViewProps) => {
  // const [open, setOpen] = React.useState(true);

  const { setActiveDoc, data, expanded } = props;

  /*
    <RecursiveItem data={sampleData} depth={0}></RecursiveItem>
   */
  return (
    <RecursivePPTreeList
      data={data}
      depth={0}
      expanded={expanded}
      setActiveDoc={setActiveDoc}
    />
  );
};

export { GithubCatalogTreeView };
