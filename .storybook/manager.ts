import { addons } from '@storybook/manager-api';

addons.setConfig({
  panelPosition: 'right',
  //selectedPanel: "controls"
});

//https://storybook.js.org/docs/configure/features-and-behavior
// addons.setConfig({
//     isFullscreen: false,
//     showNav: true,
//     showPanel: true,
//     panelPosition: 'right',
//     enableShortcuts: true,
//     showToolbar: true,
//     theme: undefined,
//     selectedPanel: undefined,
//     initialActive: 'sidebar',
//     sidebar: {
//       showRoots: false,
//       collapsedRoots: ['other'],
//     },
//     toolbar: {
//       title: { hidden: false },
//       zoom: { hidden: false },
//       eject: { hidden: false },
//       copy: { hidden: false },
//       fullscreen: { hidden: false },
//     },
//   });
