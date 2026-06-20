import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import { TreeViewer, TreeManager } from '../../..'
import { type TreeNode } from '../../..';


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
    const wrapperElement = screen.getAllByTestId('treeviewer-wide-root')
    expect(wrapperElement[0]).toBeInTheDocument();
  });

  test('default leaf label uses last /-separated segment of node.path', () => {
    const tree: TreeNode[] = [
      { type: 'blob', path: 'README.md' },
      { type: 'blob', path: 'docs/intro.md' },
    ];
    render(<TreeViewer folder={tree} onSelect={() => {}} expanded={false} />);
    expect(screen.getByText('README.md')).toBeInTheDocument();
    expect(screen.getByText('intro.md')).toBeInTheDocument();
  });

  test('renderLabel overrides default path-based labelling for both leaves and folder headers', () => {
    const tree: TreeNode[] = [
      {
        type: 'tree',
        path: 'uuid-1234',
        children: [{ type: 'blob', path: 'uuid-1234/uuid-5678' }],
      },
    ];
    const renderLabel = (node: TreeNode) =>
      `pretty-${node.path.toUpperCase()}`;
    render(
      <TreeViewer
        folder={tree}
        onSelect={() => {}}
        expanded={true}
        renderLabel={renderLabel}
      />,
    );
    expect(screen.getByText('pretty-UUID-1234')).toBeInTheDocument();
    expect(screen.getByText('pretty-UUID-1234/UUID-5678')).toBeInTheDocument();
    // The default '/'-split labels are not present.
    expect(screen.queryByText('uuid-1234')).not.toBeInTheDocument();
    expect(screen.queryByText('uuid-5678')).not.toBeInTheDocument();
  });

  test('no per-node data-testid is emitted by default', () => {
    const tree: TreeNode[] = [{ type: 'blob', path: 'a.md' }];
    render(<TreeViewer folder={tree} onSelect={() => {}} expanded={false} />);
    expect(screen.queryByTestId('leaf-a.md')).not.toBeInTheDocument();
  });

  test('getDataTestId assigns per-node data-testid; depth starts at 1 for root-level nodes', () => {
    const tree: TreeNode[] = [
      {
        type: 'tree',
        path: 'src',
        children: [{ type: 'blob', path: 'src/index.ts' }],
      },
    ];
    const getDataTestId = (node: TreeNode, depth: number) =>
      `node-${node.path}@${depth}`;
    render(
      <TreeViewer
        folder={tree}
        onSelect={() => {}}
        expanded={true}
        getDataTestId={getDataTestId}
      />,
    );
    // top-level folder 'src' is at depth 1 (root list is depth 0).
    expect(screen.getByTestId('node-src@1')).toBeInTheDocument();
    // nested leaf 'src/index.ts' is at depth 2.
    expect(screen.getByTestId('node-src/index.ts@2')).toBeInTheDocument();
  });

  test('expanded prop syncs to internal open state after first mount', () => {
    // A single folder named 'parent' with one visible leaf 'parent/leaf.md'.
    const tree: TreeNode[] = [
      {
        type: 'tree',
        path: 'parent',
        children: [{ type: 'blob', path: 'parent/leaf.md' }],
      },
    ];

    // Initially collapsed.
    const { rerender } = render(
      <TreeViewer folder={tree} onSelect={() => {}} expanded={false} />,
    );
    expect(screen.getByText('parent')).toBeInTheDocument();
    expect(screen.queryByText('leaf.md')).not.toBeInTheDocument();

    // Flip the controlled `expanded` prop without any user click. Pre-fix,
    // TreeItem's internal `useState(expanded)` ignored this update; post-fix
    // a `useEffect` re-syncs `open` so the controlled prop drives the tree.
    rerender(
      <TreeViewer folder={tree} onSelect={() => {}} expanded={true} />,
    );
    expect(screen.getByText('leaf.md')).toBeInTheDocument();
  });

  test('leaf DOM node identity survives rerender (stable keys)', () => {
    // Pre-fix, `key={uuidv4()}` regenerated on every render and React
    // remounted every leaf. Post-fix, keys derive from `node.path`, so the
    // DOM node a previous render mounted is reused on the next — queryable
    // by identity. MUI v7 `ListItemButton` renders as a `<div>` with
    // `role="button"` (not a native `<button>`), so we match by role.
    const tree: TreeNode[] = [{ type: 'blob', path: 'leaf.md' }];
    const initial = render(
      <TreeViewer folder={tree} onSelect={() => {}} expanded={false} />,
    );
    const firstLeaf = initial.container.querySelector('[role="button"]');
    expect(firstLeaf).not.toBeNull();
    expect(firstLeaf?.textContent).toContain('leaf.md');

    initial.rerender(
      <TreeViewer folder={tree} onSelect={() => {}} expanded={false} />,
    );
    const secondLeaf = initial.container.querySelector('[role="button"]');
    expect(secondLeaf).not.toBeNull();
    expect(secondLeaf?.textContent).toContain('leaf.md');

    expect(secondLeaf).toBe(firstLeaf);
  });

  test('clicking a leaf calls onSelect with the leaf node', () => {
    const tree: TreeNode[] = [{ type: 'blob', path: 'clickable.md' }];
    const onSelect = jest.fn();
    render(
      <TreeViewer folder={tree} onSelect={onSelect} expanded={false} />,
    );
    fireEvent.click(screen.getByText('clickable.md'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ path: 'clickable.md', type: 'blob' }),
    );
  });
});

describe('TreeManager', () => {
  test('traverse visits nodes depth-first, parent before children, in declaration order', () => {
    // Tree:
    //   alpha
    //     alpha/beta
    //     alpha/gamma
    //       alpha/gamma/delta
    //   epsilon
    //     epsilon/zeta
    const tree: TreeNode[] = [
      {
        type: 'tree',
        path: 'alpha',
        children: [
          { type: 'blob', path: 'alpha/beta' },
          {
            type: 'tree',
            path: 'alpha/gamma',
            children: [{ type: 'blob', path: 'alpha/gamma/delta' }],
          },
        ],
      },
      {
        type: 'tree',
        path: 'epsilon',
        children: [{ type: 'blob', path: 'epsilon/zeta' }],
      },
    ];

    const visited: string[] = [];
    new TreeManager(tree).traverse((node) => visited.push(node.path));

    expect(visited).toEqual([
      'alpha',
      'alpha/beta',
      'alpha/gamma',
      'alpha/gamma/delta',
      'epsilon',
      'epsilon/zeta',
    ]);
  });

  test('add/delete/move are stubs and do not throw when called', () => {
    // The stubs used to log an undefined `parent` symbol and throw a
    // ReferenceError on call. They now log a labelled stub message. This
    // assertion would fail pre-fix with a ReferenceError.
    const tm = new TreeManager(sample3);
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    expect(() => tm.add({ type: 'blob', path: 'a/b/x.md' }, [])).not.toThrow();
    expect(() => tm.delete('blob', 'a/b/k.md')).not.toThrow();
    expect(() => tm.move('a/b', 'a/b/c')).not.toThrow();
    // Each stub logs at least once with a marker including "(stub)".
    const stubCalls = consoleLogSpy.mock.calls.filter((args) =>
      String(args[0]).includes('(stub)'),
    );
    expect(stubCalls.length).toBeGreaterThanOrEqual(3);
    consoleLogSpy.mockRestore();
  });
});
