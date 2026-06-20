# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

`react-tree-manager` is a published React component library (npm package) built on MUI v7. It exports two things:
- `TreeViewer` — an expandable MUI `List` that recursively renders a `TreeNode[]` (a Git/GitHub-like blob/tree structure)
- `TreeManager` — a TypeScript class for headless tree manipulation. `traverse` is the only real method (`add`/`delete`/`move` are stubs that only `console.log` — see Stability matrix below)

Released via `release-it` with semver. Versioning uses `rc` pre-releases for development. Trusted publishing via OIDC. Current line of work targets **0.12.0**; CHANGELOG.md is authoritative for the per-version history and stability status of each public symbol.

## Commands

All commands use `yarn` (this repo ships a `yarn.lock`).

- `yarn build` — Rollup builds CJS (`build/index.js`), ESM (`build/index.es.js`), and types (`build/index.d.ts` → rolled up to `build/index.d.ts` via `rollup-plugin-dts`). Entry is `src/index.ts`.
- `yarn test` — `react-scripts test` (Jest + Testing Library). To run a single test: `yarn test -- -t "test name"` or `yarn test -- --testPathPattern=TreeViewer`.
- `yarn storybook` — Storybook dev server on port 6006.
- `yarn build-storybook` — Static Storybook build (CI deploys `storybook-static/` to GitHub Pages via `bitovi/github-actions-storybook-to-github-pages`).
- `yarn release` — `release-it` in interactive mode. CI runs it with `--ci --increment=<major|minor|patch>`.
- `./update.sh -p|-m|-j` — Local helper: install, build, bump version, `npm publish`.
- `./publish-beta.sh` — Pre-release helper: commit, build, bump prerelease, publish to npm with `--tag beta`.

There is no separate lint script; ESLint config is in `package.json` (`react-app`, `react-app/jest`, `plugin:storybook/recommended`).

## Code Architecture

```
src/
  index.ts                                         # Public re-exports
  lib/
    components/alerts/ErrorAlert.tsx               # Currently NOT re-exported
    widgets/tree-view-next/                        # The actual library
      WideListTree.tsx                             # TreeViewer component
      helpers/
        treemgmt.ts                                # TreeManager class + TreeNode type
        utils.ts                                   # uuidv4, bytesToSize, getFilePathWithoutFilename
  stories/                                         # Storybook stories + tests
  setupTests.ts                                    # Loads @testing-library/jest-dom
```

**Public API surface** (defined in [src/index.ts](src/index.ts)):
- `TreeViewer` — alias for `WideRecursiveList` from [WideListTree.tsx](src/lib/widgets/tree-view-next/WideListTree.tsx). Props: `folder: TreeNode[]`, `expanded: boolean`, `onSelect: (node: TreeNode) => void`, optional `renderLabel(node): ReactNode` and `getDataTestId(node, depth): string | undefined`.
- `TreeManager` class and `TreeManagerInstance` (now `InstanceType<typeof TreeManager>`), `TreeNode` types — from [treemgmt.ts](src/lib/widgets/tree-view-next/helpers/treemgmt.ts).

**Stability matrix** (from `CHANGELOG.md`):
- `TreeManager.traverse` and `TreeNode` — **stable**. `traverse` guarantees DFS, parent-before-children (locked in JSDoc); treat as contract.
- `TreeViewer` / `WideRecursiveList` — **unstable**. Bugs and additive props are still landing (e.g. `renderLabel`, `getDataTestId` were added without breaking anything). Don't tightly couple to internal layout.
- `TreeManager.add` / `delete` / `move` — **stubs**. They only `console.log` a `'(stub)'` marker; calling them is safe but they don't mutate anything.

**Component architecture** (`WideListTree.tsx`): `WideRecursiveList` maps over roots → renders `TreeItem` for nodes with children (header + `Collapse` + nested list) or `LeafItem` for blobs (`ArticleIcon` + `ListItemButton`). Per-folder open/close state is local `React.useState` that **resyncs to the `expanded` prop in a `useEffect`** — a controlled-`expanded` prop now reacts correctly after first mount (previous behaviour silently ignored it). List keys derive from `node.path` (not `uuidv4()`), so leaves keep DOM identity across rerenders — no input-focus loss, no animation restarts. Default label is the last segment of `path` (split on `/`); pass `renderLabel` to override for non-`/`-separated domains (e.g. uuid names). Pass `getDataTestId` to emit per-node `data-testid` attributes for RTL/Playwright targeting.

**`TreeManager`** holds a `tree: TreeNode[]` and exposes `traverse(callback)` (DFS, parent before children — JSDoc-enforced). `add` / `delete` / `move` are unimplemented stubs that log `'(stub)'`. Do not assume they persist state.

**Storybook** wraps stories with light/dark MUI themes via `withThemeFromJSXProvider` (see [.storybook/preview.ts](.storybook/preview.ts)). Roboto fonts are loaded there. Stories use `Meta`/`StoryObj` from `@storybook/react-webpack5`.

## Release / CI Flow

Three workflows in `.github/workflows/`:

- `release.yml` — on PR **closed** to `development` from `hotfix/` or `feature/` branches, IF the PR was merged and labeled with major/minor/patch: run tests, `yarn build`, `yarn release --ci --increment=<label>`, deploy storybook to GitHub Pages.
- `prerelease.yml` — on PR **synchronize** to `development` (not skipped via `--skip-ci` in commit message): build + bump prerelease tag (`x.y.z-rc.N`) using `--preid rc`.
- `branch.yml`, `semver-check.yml` — additional CI checks.

Trusted publishing is enabled; the workflow upgrades npm to support OIDC (`npm install -g npm@latest`).

## Things To Know

- React 19 + `@types/react` 19; `react-scripts@5.0.1` (CRA — Jest wiring is from CRA, not from a bare Jest install). `peerDependencies` pin `react >=18`.
- MUI v7, XState v5 + `@xstate/react` are dependencies (XState is currently unused by source; README still credits it).
- TypeScript 6, target ES2022, `moduleResolution: "bundler"`. `emitDeclarationOnly: true` — Rollup emits declarations via `rollup-plugin-dts`.
- No lint/format script runs in CI; ESLint config exists but isn't invoked by `yarn test` or `yarn build`.
- Tests cover more than render-only checks: `src/lib/widgets/tree-view-next/TreeViewer.test.tsx` exercises default labelling, `renderLabel` override, `getDataTestId` (depth=1 at root, N+1 below), `expanded`-prop resync after mount, leaf DOM-identity preservation across rerender, click→`onSelect` wiring, `TreeManager` DFS ordering, and that stub methods don't throw and log `'(stub)'`.
- `src/lib/components/alerts/ErrorAlert.tsx` and `src/stories/ErrorAlert.stories_future.tsx` exist but are not wired into the public export — vestigial.
- Branch policy: main is the default; current development/release work targets `development` via PR. Hotfix branches use `hotfix/*`, features use `feature/*` (enforced by `release.yml`).