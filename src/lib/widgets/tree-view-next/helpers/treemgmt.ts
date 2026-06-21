/**
 * Generic `TreeManager` library.
 *
 * `TreeManager` is class-generic over the tree node shape. The only
 * structural requirement is that nodes expose a `children` field
 * (`DefaultTreeNode`); consumers whose domain nodes use a different
 * key for child access can override that via `TreeManagerOptions.getChildren`.
 *
 * The legacy `TreeNode` shape `{ path, type, children? }` remains
 * reachable from this file (and re-exported via `src/index.ts`) so
 * existing consumers don't break.
 */

/**
 * Default contract: anything with an optional `children` field can be a
 * tree node. This is intentionally minimal — consumers can extend their
 * own node shapes, then parameterise `TreeManager` over them.
 */
interface DefaultTreeNode {
  children?: DefaultTreeNode[];
}

/**
 * Per-traversal options. Pass to `traverse`, `toArray`, `collectIds`,
 * `findBy`, or `getPath`. All fields are optional.
 */
interface TreeManagerOptions<N> {
  /**
   * How to read children off a node. Default: `(node) => node.children`.
   * Override when the consumer's domain node uses a different key, e.g.
   * `getChildren: (n) => n.kids`.
   */
  getChildren?: (node: N) => ReadonlyArray<N> | undefined | null;
  /**
   * When `false`, the per-node callback is NOT invoked on root nodes —
   * only on their descendants. Default: `true` (callbacks fire on every
   * node, including roots).
   */
  includeRoot?: boolean;
}

/**
 * Legacy tree node shape. Kept for backward compatibility with code
 * that imports `TreeNode` directly. New code is encouraged to
 * parameterise `TreeManager` over its own domain node type instead.
 */
type TreeNode = {
  children?: TreeNode[];
  path: string;
  type: 'blob' | 'tree';
};

class TreeManager<N extends object = DefaultTreeNode> {
  public tree: N[];

  constructor(tree?: N[]) {
    this.tree = tree ?? [];
  }

  /**
   * Default children extractor. Reads `node.children` only when N is
   * structurally compatible with `DefaultTreeNode`; otherwise returns
   * `[]`. Because the default is always overridable via
   * `TreeManagerOptions.getChildren`, callers that don't carry a
   * `children` field never reach this code path.
   */
  private defaultFetchChildren(node: N): ReadonlyArray<N> {
    const candidate = node as unknown as {
      children?: ReadonlyArray<N>;
    };
    return (candidate.children ?? []) as ReadonlyArray<N>;
  }

  /**
   * Depth-first traversal.
   *
   * **Contract:** the callback is invoked on the parent *before* its
   * children, and children are visited in declaration order. Roots are
   * visited in declaration order. This ordering is part of the stable
   * API — downstream id-collection and other walks depend on it
   * (locked in JSDoc since 0.12.0).
   *
   * `includeRoot: false` skips invoking the callback on root-level
   * nodes themselves; their descendants are still visited. Inside the
   * recursive walk this is parameterised by a `fire` flag so that the
   * "fire at root, walk descendants" intent is preserved independently
   * at every level.
   *
   * @param callback Function called once per visited node in DFS order.
   * @param options Optional. `includeRoot` (default `true`) controls
   *   whether roots are visited. `getChildren` (default
   *   `(node) => node.children`) controls how children are read.
   */
  public traverse(
    callback: (node: N) => void,
    options?: TreeManagerOptions<N>,
  ): void {
    const includeRoot = options?.includeRoot ?? true;
    const fetchChildren =
      options?.getChildren ?? this.defaultFetchChildren.bind(this);

    const depthFirst = (node: N, fire: boolean): void => {
      if (fire) callback(node);
      const children = fetchChildren(node);
      if (children) {
        for (const child of children) depthFirst(child, true);
      }
    };

    for (const rootNode of this.tree) {
      depthFirst(rootNode, includeRoot);
    }
  }

  /**
   * Flatten the tree to an array of nodes, depth-first.
   *
   * Honours `includeRoot` (default `true`) and `getChildren`. Without
   * options this is a thin wrapper over `traverse(node => push(node))`.
   */
  public toArray(options?: TreeManagerOptions<N>): N[] {
    const out: N[] = [];
    this.traverse((node) => out.push(node), options);
    return out;
  }

  /**
   * Map `toArray` to id extraction. `idKey` is constrained to `keyof N`
   * so the return type stays narrowly typed against the node shape.
   *
   * @param idKey Property whose value is collected for each visited node.
   * @param options Same as `traverse`. `includeRoot` defaults to `true`,
   *   matching `toArray`/`traverse` so consumers can opt out by passing
   *   `{ includeRoot: false }`.
   */
  public collectIds<K extends keyof N>(
    idKey: K,
    options?: TreeManagerOptions<N>,
  ): Array<N[K]> {
    const out: Array<N[K]> = [];
    this.traverse((node) => out.push(node[idKey]), options);
    return out;
  }

  /**
   * Return the first node matching `predicate`, depth-first. Returns
   * `null` if no node matches. Honours `getChildren`. `includeRoot`
   * applies (`true` by default).
   */
  public findBy(
    predicate: (node: N) => boolean,
    options?: TreeManagerOptions<N>,
  ): N | null {
    let found: N | null = null;
    this.traverse(
      (node) => {
        if (found === null && predicate(node)) found = node;
      },
      options,
    );
    return found;
  }

  /**
   * Return the chain of nodes from some root down to the first node
   * matching `predicate`, inclusive at both ends. Returns `null` if no
   * node matches. Honours `getChildren`.
   *
   * Useful for breadcrumbs / recents / "open this in tree" UX without
   * rolling a hand-rolled BFS-with-parent every time.
   */
  public getPath(
    predicate: (node: N) => boolean,
    options?: TreeManagerOptions<N>,
  ): N[] | null {
    const fetchChildren =
      options?.getChildren ?? this.defaultFetchChildren.bind(this);
    let found: N[] | null = null;
    const dfs = (node: N, ancestors: ReadonlyArray<N>): boolean => {
      const here: N[] = [...ancestors, node];
      if (predicate(node)) {
        found = here;
        return true;
      }
      const children = fetchChildren(node);
      if (children) {
        for (const child of children) {
          if (dfs(child, here)) return true;
        }
      }
      return false;
    };
    for (const root of this.tree) {
      if (dfs(root, [])) break;
    }
    return found;
  }

  // NOTE: `add`, `delete`, and `move` are intentional stubs in this
  // release. They only emit a console.log so library users can confirm
  // the call is wired up; they do not mutate the tree. Treat them as
  // placeholders until a real implementation lands. See CHANGELOG.md
  // for the stability matrix.
  //
  // Signatures are intentionally permissive where the generic makes
  // them sensible: `add(node: N, tree: N[])` keeps the typed-pair
  // surface for in-place addition; `delete(...args)` widens the
  // previously-typed `type`/`path` discriminator for compat; `move`
  // stays string-string because that's what callers expect.
  public add(node: N, tree: N[]): N[] | void {
    console.log('[TreeManager.add] (stub)', { node, tree });
  }

  public delete(...args: unknown[]): void {
    console.log('[TreeManager.delete] (stub):', args);
  }

  public move(from: string, to: string): void {
    console.log('[TreeManager.move] (stub):', { from, to });
  }
}

export { TreeManager };
export type TreeManagerInstance = InstanceType<typeof TreeManager>;
export type {
  TreeManagerOptions,
  TreeNode,
  DefaultTreeNode,
};
