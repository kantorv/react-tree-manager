import * as React from 'react';
import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';

import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeNode, TreeContentItem, TreeViewMode } from '../../types/lib.types';
import { CatalogViewFlatListGrouped } from './FlatListGrouped';
import { GithubCatalogTreeView } from './LeftSidebarCatalogTree';
import { TreeModeToggle } from './TreeModeToggle';
// import {FileFolderCreateButtons} from './FileFolderCreateButtons'

import { WideRecursiveList } from './WideListTree';

import { traverseTree } from '../../helpers/utils';
// import { type LocalFSMachineActorRef } from '../../../machines/localfs';
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

type ProjectExplorerProps = {
  //   svc: LocalFSMachineActorRef,
  // onFileOpen: (path: string) => void,
  // backFn: ()=>void
  // LocalFSMachineActorRef
  tree: TreeNode[];
};

const ProjectExplorer = (props: ProjectExplorerProps) => {
  const theme = useTheme();
  const { tree } = props;

  //   const {svc,onFileOpen, backFn } = props

  // const config = useSelector(svc, (state) => state.context.config)
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [mdfiles, setMdfiles] = useState<TreeContentItem[]>([]);

  const [treeType, setTreeType] = useState<TreeViewMode>('compact');

  // const viewmode = useSelector(svc, (state) => state.context.config).ui_settings.tree_display_settings.viewMode

  //   useEffect(()=>{
  //     try{

  //         const val =  config.ui_settings.tree_display_settings.viewMode
  //         setTreeType(val)
  //         console.log("ProjectExplorer config updated", val, config)
  //     }
  //     catch{
  //         console.log("ProjectExplorer config not updated", config)
  //     }

  //   },[config])

  const setActiveDoc = (path: string) => {
    console.log('[setActiveDoc] called', path);
  };
  // path: string;
  // mode: string;
  // type: "blob" | "tree";
  // sha: string;
  // size?: number;
  // url: string;

  useEffect(() => {
    const files = traverseTree({
      type: 'tree',
      path: '',
      children: tree,
    });

    const random = crypto.randomUUID();

    /* eslint-disable-next-line no-underscore-dangle */
    const _mdfiles = files.map(
      (s, i) =>
        ({
          path: s,
          size: 0,
          type: 'blob',
          mode: '100755',
          sha: `${random}-${i}`,
          url: '',
        }) as TreeContentItem
    );
    setMdfiles(_mdfiles);
    // console.log("BuiltinTreeSample", files)
  }, [tree]);

  useEffect(() => {
    console.log('ProjectExplorer mdfiles updated', mdfiles);
  }, [mdfiles]);

  //    const mdfiles: ({ event }) => event.output.tree.filter((item: GhRepoTreeContentItem) => /(\w+)\.(md|markdown)$/i.test(item.path))

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <DrawerHeader>
        <IconButton
          edge="start"
          sx={{ ml: 1 }}
          color="inherit"
          onClick={() => {}}
        >
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
        {/* <FileFolderCreateButtons /> */}
        <div
          style={{
            flexGrow: 1,
          }}
        />
        <TreeModeToggle mode={treeType} setMode={setTreeType} />
      </DrawerHeader>
      <Divider />

      {treeType === 'flat' ? (
        <CatalogViewFlatListGrouped
          mdfiles={mdfiles}
          setActiveDoc={setActiveDoc}
        />
      ) : treeType === 'wide' ? (
        <WideRecursiveList setActiveDoc={setActiveDoc} data={tree} expanded />
      ) : treeType === 'compact' ? (
        <GithubCatalogTreeView
          setActiveDoc={setActiveDoc}
          data={tree}
          expanded
        />
      ) : null}
    </Box>
  );
};

export { ProjectExplorer };
