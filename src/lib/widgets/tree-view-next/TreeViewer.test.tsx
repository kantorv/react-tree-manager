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
  // Shared shape used across the new helper-method tests. Mirror of the
  // alpha/epsilon tree used inline below; kept here so all the helper
  // tests reference the same DFS reference order.
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

  test('traverse with { includeRoot: false } skips roots', () => {
    // Same sample as the basic DFS test, but includeRoot:false should drop
    // 'alpha' and 'epsilon' from the visit list and only yield the
    // descendants — useful for "exclude the selection itself from the
    // descendants filter" patterns.
    const visited: string[] = [];
    new TreeManager(tree).traverse(
      (node) => visited.push(node.path),
      { includeRoot: false },
    );
    expect(visited).toEqual([
      'alpha/beta',
      'alpha/gamma',
      'alpha/gamma/delta',
      'epsilon/zeta',
    ]);
  });

  test('traverse with custom getChildren pulls from a non-`children` key', () => {
    // Domain node whose children live under `kids` — proves the
    // generic-with-options flow without forcing a runtime cast at the
    // call site.
    interface DomainNode {
      id: string;
      kids?: DomainNode[];
    }
    const domain: DomainNode[] = [
      {
        id: 'a',
        kids: [{ id: 'a/k1' }, { id: 'a/k2', kids: [{ id: 'a/k2/u' }] }],
      },
      { id: 'b' },
    ];
    const visited: string[] = [];
    new TreeManager<DomainNode>(domain).traverse(
      (node) => visited.push(node.id),
      { getChildren: (node) => node.kids ?? [] },
    );
    expect(visited).toEqual(['a', 'a/k1', 'a/k2', 'a/k2/u', 'b']);
  });

  test('toArray returns the same nodes as traverse, in DFS order', () => {
    expect(new TreeManager(tree).toArray().map((n) => n.path)).toEqual([
      'alpha',
      'alpha/beta',
      'alpha/gamma',
      'alpha/gamma/delta',
      'epsilon',
      'epsilon/zeta',
    ]);
  });

  test('toArray({ includeRoot: false }) excludes roots', () => {
    expect(
      new TreeManager(tree)
        .toArray({ includeRoot: false })
        .map((n) => n.path),
    ).toEqual([
      'alpha/beta',
      'alpha/gamma',
      'alpha/gamma/delta',
      'epsilon/zeta',
    ]);
  });

  test('collectIds returns ids in DFS, parent-before-children order, via keyof N typing', () => {
    const ids = new TreeManager(tree).collectIds('path');
    // Return type is `TreeNode['path'][]` (i.e. `string[]`) without
    // needing a runtime cast — locks the typed-key behaviour this
    // release's generic refactor introduced.
    expect(ids).toEqual([
      'alpha',
      'alpha/beta',
      'alpha/gamma',
      'alpha/gamma/delta',
      'epsilon',
      'epsilon/zeta',
    ]);
  });

  test('collectIds with includeRoot: false returns descendants only', () => {
    expect(
      new TreeManager(tree).collectIds('path', { includeRoot: false }),
    ).toEqual([
      'alpha/beta',
      'alpha/gamma',
      'alpha/gamma/delta',
      'epsilon/zeta',
    ]);
  });

  test('findBy returns the first matching node (DFS), or null when nothing matches', () => {
    const tm = new TreeManager(tree);
    expect(tm.findBy((n) => n.path === 'alpha/gamma/delta')?.path).toBe(
      'alpha/gamma/delta',
    );
    expect(tm.findBy((n) => n.path === 'alpha/gamma')?.path).toBe(
      'alpha/gamma',
    );
    // Returns null when no node matches — the contract `findNodeById`
    // in `tree-manager-adapter` relies on.
    expect(tm.findBy((n) => n.path === 'never-present')).toBeNull();
  });

  test('getPath returns the chain root → first matching node, or null', () => {
    const tm = new TreeManager(tree);
    expect(tm.getPath((n) => n.path === 'alpha/gamma/delta')?.map((n) => n.path)).toEqual([
      'alpha',
      'alpha/gamma',
      'alpha/gamma/delta',
    ]);
    // A root matches itself: path has length 1.
    expect(tm.getPath((n) => n.path === 'alpha')?.map((n) => n.path)).toEqual([
      'alpha',
    ]);
    // No match → null.
    expect(tm.getPath((n) => n.path === 'never-present')).toBeNull();
  });

  test('TreeManager is generic over arbitrary node shapes', () => {
    // Type check: parameterising over a domain node that does not
    // extend `TreeNode` at all still compiles without `as unknown as
    // ` casts. If the next package bump reverts to a non-generic
    // implementation, this test stops compiling.
    interface MyCategory {
      id: string;
      name: string;
      children?: MyCategory[];
    }
    const cat: MyCategory = {
      id: 'root',
      name: 'Root',
      children: [{ id: 'child', name: 'Child' }],
    };
    const ids: string[] = new TreeManager<MyCategory>([cat]).collectIds('id');
    expect(ids).toEqual(['root', 'child']);
  });
});
