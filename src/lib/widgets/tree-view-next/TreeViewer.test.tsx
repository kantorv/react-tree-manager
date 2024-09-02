import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import { TreeViewer } from '../../..'


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

  

describe('TreeViewer', () => {
  test('renders root with the correct testid', () => {
    

    render(<TreeViewer folder={sample3}  onSelect={()=>{}} expanded={true} />);
    
    // Check if the button is rendered with the correct text
    const wrapperElement = screen.getAllByTestId('treeviewer-wide-root')
    expect(wrapperElement[0]).toBeInTheDocument();
  });
});
