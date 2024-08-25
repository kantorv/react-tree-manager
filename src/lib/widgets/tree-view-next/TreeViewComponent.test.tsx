import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
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

  

describe('TreeComponent', () => {
  test('renders tree with the correct label', () => {
    render(<TreeViewComponent tree={sample3} />);
    
    // Check if the button is rendered with the correct text
    const wrapperElement = screen.getByTestId('tree-component-wrapper')
    expect(wrapperElement).toBeInTheDocument();
  });
});
