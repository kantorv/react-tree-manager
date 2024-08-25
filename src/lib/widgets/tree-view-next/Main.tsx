import * as React from 'react';
import { TreeViewComponent } from './TreeViewComponent'


const sample3: TreeNode[] = [
  {
    type: 'blob',
    path: 'q.md',
  },
  {
    type: 'tree',
    path: 'subfolder',
    children: [
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
    ],
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

const TreeViewer = () => <TreeViewComponent tree={sample3} />;

export { TreeViewer };
