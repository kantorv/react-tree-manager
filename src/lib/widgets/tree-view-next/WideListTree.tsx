import * as React from 'react';
import {
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Collapse,
} from '@mui/material';
import {
  ExpandMore,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Article as ArticleIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';
import { type TreeNode } from './helpers/treemgmt';

// Default leaf label. Splits the `path` on `/` and takes the final segment
// — matches the pre-`renderLabel` behaviour. When a consumer's domain
// doesn't use `/` as a separator they should pass `renderLabel` and skip
// this fallback entirely.
const defaultRenderLabel = (node: TreeNode): string =>
  node.path.split('/').pop() ?? node.path;

type ItemRenderContext = {
  node: TreeNode;
  depth: number;
  renderLabel: (node: TreeNode) => React.ReactNode;
  getDataTestId?: (node: TreeNode, depth: number) => string | undefined;
};

type LeafItemProps = {
  onSelect: (node: TreeNode) => void;
} & ItemRenderContext;

const LeafItem = (props: LeafItemProps) => {
  const { node, onSelect, renderLabel, depth, getDataTestId } = props;
  const dataTestId = getDataTestId?.(node, depth);
  return (
    <ListItemButton
      divider
      onClick={() => onSelect(node)}
      {...(dataTestId ? { 'data-testid': dataTestId } : {})}
    >
      <ListItemIcon>
        <ArticleIcon />
     </ListItemIcon>
      <ListItemText primary={renderLabel(node)} />
   </ListItemButton>
  );
};

type TreeItemHeaderProps = {
  onClick: (path: string) => void;
  node: TreeNode;
  expanded: boolean;
} & Pick<ItemRenderContext, 'renderLabel' | 'depth' | 'getDataTestId'>;

const TreeItemHeader = (props: TreeItemHeaderProps) => {
  const { node, onClick, expanded, renderLabel, depth, getDataTestId } =
    props;
  const dataTestId = getDataTestId?.(node, depth);
  return (
    <ListItemButton
      onClick={() => onClick(node.path)}
      divider
      {...(dataTestId ? { 'data-testid': dataTestId } : {})}
    >
      <ListItemIcon>
        <FolderIcon />
     </ListItemIcon>
      <ListItemText primary={renderLabel(node)} />
      {expanded ? (
        <ExpandMore fontSize="small" />
      ) : (
        <KeyboardArrowRightIcon fontSize="small" />
      )}
   </ListItemButton>
  );
};

type TreeItemProps = {
  children?: React.ReactNode;
  expanded: boolean;
} & Omit<ItemRenderContext, 'node'> & { node: TreeNode };

const TreeItem = (props: TreeItemProps) => {
  const { children, node, expanded, renderLabel, depth, getDataTestId } =
    props;

  const [open, setOpen] = React.useState(expanded);
  // Keep local open state in sync with the controlled `expanded` prop.
  // Without this, a parent that flips `expanded={true}` after first mount
  // sees its change silently ignored.
  React.useEffect(() => {
    setOpen(expanded);
  }, [expanded]);

  const handleClick = () => setOpen((prev) => !prev);

  return (
    <>
      <TreeItemHeader
        expanded={open}
        node={node}
        onClick={handleClick}
        renderLabel={renderLabel}
        depth={depth}
        getDataTestId={getDataTestId}
      />
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
  /**
   * Override the default label extraction. Default: last `/`-separated
   * segment of `node.path`. Pass this for any domain that doesn't use
   * `/` as a path separator (e.g. uuid-based ids).
   */
  renderLabel?: (node: TreeNode) => React.ReactNode;
  /**
   * Optional. When provided, every rendered item gets a `data-testid`
   * derived from this callback (signatures `(node, depth)` returning a
   * string). When omitted, no per-node `data-testid` is emitted and
   * only the root `treeviewer-wide-root` testid is present. Default:
   * `undefined`.
   */
  getDataTestId?: (node: TreeNode, depth: number) => string | undefined;
  /**
   * Internal — tracks recursion depth. Consumers do not pass this.
   */
  depth?: number;
};

const WideRecursiveList = (props: WideRecursiveListProps) => {
  const {
    folder,
    onSelect,
    expanded,
    renderLabel = defaultRenderLabel,
    getDataTestId,
    depth = 0,
  } = props;

  return (
    <List
      sx={{ width: '100%' }}
      component="nav"
      data-testid="treeviewer-wide-root"
    >
      {folder.map((node) => {
        // Key by `node.path` — paths are guaranteed unique within a single
        // folder (a sibling list). The previous `key={uuidv4()}` regenerated
        // on every render, which remounted every leaf on any prop change
        // (focus loss in inputs inside leaves, animation restarts, layout
        // thrash). See CHANGELOG "0.12.0 — Fixed" entry.
        const childDepth = depth + 1;
        return node.children?.length ? (
          <TreeItem
            key={node.path}
            node={node}
            expanded={expanded}
            renderLabel={renderLabel}
            depth={childDepth}
            getDataTestId={getDataTestId}
          >
            <WideRecursiveList
              folder={node.children}
              expanded={expanded}
              onSelect={onSelect}
              renderLabel={renderLabel}
              getDataTestId={getDataTestId}
              depth={childDepth}
            />
         </TreeItem>
        ) : (
          <LeafItem
            key={node.path}
            node={node}
            onSelect={onSelect}
            renderLabel={renderLabel}
            depth={childDepth}
            getDataTestId={getDataTestId}
          />
        );
      })}
   </List>
  );
};

export { WideRecursiveList };
