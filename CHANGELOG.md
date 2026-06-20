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

## Unreleased

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
