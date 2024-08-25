import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Divider, Paper } from '@mui/material';
import { ProjectFormHeader } from './ProjectFormHeader';
import { type TreeNode } from '../../types/lib.types';
import { EditableTree } from './EditableTree';
// import { TreeManager } from '../../../../helpers/treemgmt';
import { TopControls } from './TopControls';

import { TreeManager } from '../../service/treemgmt';

type LocalFSProjectFormProps = {
  onClose: () => void;
};


const sample = [
  {
    type: 'blob',
    path: '/md/markdown-sample-ghview.md',
  },
  {
    type: 'tree',
    path: 'somefolder',
    children: [
      {
        type: 'blob',
        path: '/md/sample.md',
      },
      {
        type: 'blob',
        path: '/md/highlight.js.md',
      },
      {
        type: 'tree',
        path: 'test665',
        children: [
          {
            type: 'blob',
            path: '/md/tf-helm-index.html.markdown',
          },
          {
            type: 'blob',
            path: 'https://raw.githubusercontent.com/bevacqua/es6/master/readme.markdown',
          },
          {
            type: 'tree',
            path: 'yooo66',
            children: [
              {
                type: 'blob',
                path: '/md/highlight5.js.md',
              },
              {
                type: 'blob',
                path: '/md/sample7.md',
              },
              {
                type: 'blob',
                path: '/md/highlight6.js.md',
              },
            ],
          },
          {
            type: 'blob',
            path: '/md/highlight2.js.md',
          },
          {
            type: 'blob',
            path: '/md/sample2.md',
          },
          {
            type: 'blob',
            path: '/md/highlight3.js.md',
          },
        ],
      },
    ],
  },
  {
    type: 'tree',
    path: 'otherfolder',
    children: [
      {
        type: 'blob',
        path: '/md/tf-helm-index.html.markdown',
      },
      {
        type: 'blob',
        path: 'https://raw.githubusercontent.com/bevacqua/es6/master/readme.markdown',
      },
    ],
  },
  {
    type: 'tree',
    path: 'folder5',
    children: [
      {
        type: 'blob',
        path: '/md/sample2.md',
      },

      {
        type: 'blob',
        path: '/md/sample5.md',
      },
      {
        type: 'blob',
        path: '/md/highlight5.js.md',
      },
      {
        type: 'tree',
        path: 'folder10',
        children: [
          {
            type: 'blob',
            path: '/md/tf-helm-index.html.markdown',
          },
          {
            type: 'blob',
            path: 'https://raw.githubusercontent.com/bevacqua/es6/master/readme.markdown',
          },
          {
            type: 'tree',
            path: 'hello55',
            children: [
              {
                type: 'blob',
                path: '/md/highlight5.js.md',
              },
              {
                type: 'blob',
                path: '/md/sample7.md',
              },
              {
                type: 'blob',
                path: '/md/highlight6.js.md',
              },
            ],
          },
          {
            type: 'blob',
            path: '/md/highlight2.js.md',
          },
          {
            type: 'blob',
            path: '/md/sample2.md',
          },
          {
            type: 'blob',
            path: '/md/highlight3.js.md',
          },
        ],
      },
    ],
  },
];

const sample2 = [
  {
    type: 'blob',
    path: '/md/markdown-sample-ghview.md',
  },
  {
    type: 'tree',
    path: 'somefolder',
    children: [
      {
        type: 'blob',
        path: '/md/sample.md',
      },
      {
        type: 'blob',
        path: '/md/highlight.js.md',
      },
    ],
  },
  {
    type: 'tree',
    path: 'otherfolder',
    children: [
      {
        type: 'blob',
        path: '/md/tf-helm-index.html.markdown',
      },
      {
        type: 'tree',
        path: 'inner',
        children: [
          {
            type: 'blob',
            path: 'somefile.markdown',
          },
        ],
      },
    ],
  },
];

const sample3: TreeNode[] = [
  {
    type: 'blob',
    path: 'q.md',
  },
  {
    type: 'tree',
    path: 'a',
    children: [
      {
        type: 'blob',
        path: 'a/h.md',
      },
      {
        type: 'tree',
        path: 'a/b',
        children: [
          {
            type: 'blob',
            path: 'a/b/k.md',
          },
          {
            type: 'tree',
            path: 'a/b/c',
            children: [
              {
                type: 'blob',
                path: 'a/b/c/y.md',
              },
            ],
          },
        ],
      },
    ],
  },
];
const LocalFSProjectForm = (props: LocalFSProjectFormProps) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const setActiveDoc = (path: string) =>
    console.log('LocalFSProjectForm.setActiveDoc called', path);
  const tmgmt = new TreeManager([]);

  const updateTree = (tree: TreeNode[]): void => {
    const normalized_tree = tmgmt.normalize_path(tree);
    // tmgmt.traverse()
    setTreeData(normalized_tree);
  };

  useEffect(() => {
    updateTree(sample3);
  }, []);

  useEffect(() => {
    console.log('[LocalFSProjectForm.useEffect] tree updated', treeData);
  }, [treeData]);

  const [selected, _setSelected] = useState<string>('');

  const setSelected = (s: string) =>
    _setSelected((prev) => (prev === s ? '' : s));

  useEffect(() => {
    console.log('[LocalFSProjectForm.useEffect] selected updated', selected);
  }, [selected]);

  return (
    <Box
      component={"div"}
      sx={{
        height: '100%',

        // background:"blue"
      }}
    >
      <Paper
        //   elevation={2}
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          borderRadius: '0 none',
          pb: 4,

          // background:"blue"
        }}
      >
        <ProjectFormHeader onClose={props.onClose} />
        <Divider />
        <TopControls
          updateTreeFn={setTreeData}
          tree={treeData}
          selected={selected}
        />
        <Divider />

        <Box
          sx={{
            // p:1,
            pb: 0,
            height: '100%',
            overflow: 'auto',
            background: 'wheat',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <EditableTree
            setActiveDoc={setActiveDoc}
            data={treeData}
            expanded
            selected={selected}
            setSelected={setSelected}
          />

          <Divider />
          <Box
            sx={{
              flexGrow: 1,
              background: 'maroon',
            }}
          />
        </Box>

        <Divider />
      </Paper>
    </Box>
  );
};

export { LocalFSProjectForm };
