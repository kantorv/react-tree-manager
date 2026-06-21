# Changelog

All notable changes to `react-tree-manager` are documented here. The format
loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
the project is pre-1.0, so semver-minor bumps can add behaviour.

## Stability matrix

Consumers should treat the public surface as follows:

| Symbol | Status |
| --- | --- |
| `TreeManager.traverse` | **stable** — depth-first, parent before children (locked in JSDoc) |
| `TreeViewer` (`WideRecursiveList`) | **unstable** — bugs and prop additions are still landing |
| `TreeManager.add` / `delete` / `move` | **stubs** — only `console.log`, behaviour not defined |
| `TreeNode` shape | **stable** |

## 0.13.0

### Added

- `TreeManager` is now class-generic over the node shape. Consumers no
  longer need `as unknown as ConstructorParameters<typeof TreeManager>[0]`
  casts at the adapter boundary — they can
  `new TreeManager<MyNode>(tree)` and get full typing for their domain
  shape.
- New exported type `TreeManagerOptions<N>` with two optional fields:
  - `getChildren?: (node: N) => ReadonlyArray<N> | undefined | null` —
    override how children are read from a node. Default reads
    `node.children`.
  - `includeRoot?: boolean` — when `false`, callbacks are not invoked
    on root nodes themselves, only on their descendants.
- New exported type `DefaultTreeNode = { children?: DefaultTreeNode[] }`,
  the structural shape the default `TreeManager` reads.

### Added (helper methods on `TreeManager<N>`)

- `toArray(options?): N[]` — flatten the tree depth-first.
- `collectIds<K extends keyof N>(idKey: K, options?): Array<N[K]>` —
  extract a typed-id array per node, depth-first. Lifts the
  `collectDescendantIds` pattern out of consumer-side adapters.
- `findBy(predicate: (node: N) => boolean, options?): N | null` — first
  matching node, DFS.
- `getPath(predicate: (node: N) => boolean, options?): N[] | null` —
  chain from a root down to the first matching node, inclusive at
  both ends. Useful for breadcrumbs / recents / "open in tree" UX
  without rolling a hand-rolled BFS-with-parent every time.

### Changed (back-compat preserved)

- The legacy `TreeNode` type is preserved and re-exported from
  `index.ts`. Direct callers that don't pass a type argument
  (`new TreeManager(tree)` with no generic) compile against
  `DefaultTreeNode` and behave identically to the pre-0.13.0 walker.
- `TreeManager.delete` widened to `(...args: unknown[]) => void`. The
  pre-0.13.0 signature `(type: 'blob' | 'tree', path: string)` doesn't
  generalise to non-`TreeNode` shapes. The stub remains a stub (no
  mutation); the wider signature accepts all prior callers without
  requiring caller updates.
- `TreeManager.add(node: N, tree: N[])` — was `(node: TreeNode, tree: TreeNode[])`.
  Generic-pair signature; pre-0.13.0 callers passing `TreeNode`
  continue to compile because `TreeNode` is structurally compatible
  with the default `DefaultTreeNode`.

### Documentation

- README updated to demonstrate `new TreeManager<MyCategory>(myTree)`
  with the new helpers (`collectIds`, `findBy`, `getPath`), instead
  of an inline `TreeNode` interface declaration.

## 0.12.0

### Added
- `TreeViewer` gains optional `renderLabel(node): ReactNode` prop. When set,
  it replaces the hard-coded `path.split('/').pop()` derivation, so consumers
  whose domain doesn't use `/` as a path separator (e.g. uuid-based ids) no
  longer get garbled labels in `TreeItemHeader` / `LeafItem`.
- `TreeViewer` gains optional `getDataTestId(node, depth): string` prop. When
  set, every rendered item receives a matching `data-testid`, so testing
  libraries (Playwright, RTL) can target individual nodes without ad-hoc
  wrapper components. Default is `undefined` — no extra `data-testid` is
  emitted.

### Fixed
- `TreeViewer` no longer regenerates a fresh `key={uuidv4()}` per render.
  Keys are now derived from `node.path`, eliminating leaf remounts, focus
  loss in inputs inside leaves, and needless layout work on prop updates.
- `TreeViewer`'s internal open state now re-syncs with the `expanded` prop
  on update via a `useEffect`, so consumers passing a controlled `expanded`
  prop see their changes reflected after first mount.
- `TreeManager.add` no longer references an undefined `parent` symbol in
  its `console.log` call (the method remains a stub; the ReferenceError
  no longer fires if it is called).

### Changed
- `TreeManagerInstance` is now derived via TypeScript's built-in
  `InstanceType<typeof TreeManager>` rather than a project-local
  `ExtractInstanceType` helper. Same shape, smaller surface.

### Documentation
- `TreeManager.traverse` callback ordering (DFS, parent before children) is
  now part of the JSDoc contract.
- README "API" section no longer advertises `add` / `remove` as real
  methods (they remain stubs).

## 0.11.6

Squashed release of bug fixes and dependency upgrades since 0.11.1.
No public-API change.
