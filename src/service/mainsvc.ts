import { setup } from 'xstate';
import { createActorContext } from '@xstate/react';

import type { TreeNode, TreeUiSettings } from '../types/lib.types';

interface MachineContext {
  tree: TreeNode[];
  ui_settings: TreeUiSettings;
}

type MachineEvent =
  | {
      name: string;
      type: 'EVENTS.FILE.CREATE';
    }
  | {
      name: string;
      type: 'EVENTS.FOLDER.CREATE';
    };

const uiSettingsDefaults: TreeUiSettings = {
  view_mode: 'wide',
  expanded: false,
  compact_tree: false,
  orderBy: 'name',
};

const treeMgmtMachine = setup({
  types: {} as {
    context: MachineContext;
    events: MachineEvent;
  },
  actors: {
    // fetchConfigFile: fromPromise(({ input }: { input: {path:string} }) => loadConfig(input.path))
  },
}).createMachine({
  id: 'treemgmtsvc',
  initial: 'idle',
  context: ({ input }) => ({
    tree: (input as { tree?: TreeNode[] }).tree ?? [],
    ui_settings:
      (input as { ui_settings?: TreeUiSettings }).ui_settings ??
      uiSettingsDefaults,
  }),

  initilal: 'idle',
  states: {
    idle: {
      entry: [({ event }) => console.log('treemgmtsvc.idle.entry', event)],
      exit: [({ event }) => console.log('treemgmtsvc.idle.exit', event)],
    },
  },
});

export const TreeMgmtMachineContext = createActorContext(treeMgmtMachine);
