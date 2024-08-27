import * as React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { TreeViewerNext } from "..";


const sample3: TreeNode[]  = [
	{
	  "type": "blob",
	  "path": "README.md"
	},
	{
	  "type": "tree",
	  "path": "docs",
	  "children": [
		{
		  "type": "tree",
		  "path": "docs/guides",
		  "children": [
			{
			  "type": "blob",
			  "path": "docs/guides/getting_started.md"
			},
			{
			  "type": "blob",
			  "path": "docs/guides/advanced_usage.md"
			},
			{
			  "type": "tree",
			  "path": "docs/guides/examples",
			  "children": [
				{
				  "type": "blob",
				  "path": "docs/guides/examples/code_snippet.js"
				},
				{
				  "type": "tree",
				  "path": "docs/guides/examples/configurations",
				  "children": [
					{
					  "type": "blob",
					  "path": "docs/guides/examples/configurations/sample_config.json"
					},
					{
					  "type": "blob",
					  "path": "docs/guides/examples/configurations/deployment.yaml"
					}
				  ]
				}
			  ]
			}
		  ]
		}
	  ]
	},
	{
	  "type": "tree",
	  "path": "src",
	  "children": [
		{
		  "type": "blob",
		  "path": "src/index.js"
		},
		{
		  "type": "tree",
		  "path": "src/components",
		  "children": [
			{
			  "type": "blob",
			  "path": "src/components/Header.jsx"
			},
			{
			  "type": "tree",
			  "path": "src/components/ui",
			  "children": [
				{
				  "type": "blob",
				  "path": "src/components/ui/Button.tsx"
				},
				{
				  "type": "blob",
				  "path": "src/components/ui/Modal.tsx"
				}
			  ]
			}
		  ]
		}
	  ]
	},
	{
	  "type": "blob",
	  "path": "LICENSE.txt"
	}
  ];
  

const meta: Meta<typeof TreeViewerNext> = {
	component: TreeViewerNext,
};

export default meta;
type Story = StoryObj<typeof TreeViewerNext>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions. */


const TreeViewerNextSample = ()=> (
	<Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        background: 'wheat',
        height: '100%',
        maxWidth: 400,
		minHeight: "100%",
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',

          p: 1,
        }}
      >
        <TreeViewerNext tree={sample3} />
      </Box>
    </Box>
)

export const Single: Story = {
	render: () => <TreeViewerNextSample />

};




/**
 * 
 * 
 

[traverse] blob -- README.md
[traverse] tree -- docs
[traverse] tree -- docs/guides
[traverse] blob -- docs/guides/getting_started.md
[traverse] blob -- docs/guides/advanced_usage.md
[traverse] tree -- docs/guides/examples
[traverse] blob -- docs/guides/examples/code_snippet.js
[traverse] tree -- docs/guides/examples/configurations
[traverse] blob -- docs/guides/examples/configurations/sample_config.json
[traverse] blob -- docs/guides/examples/configurations/deployment.yaml

[traverse] tree -- src
[traverse] blob -- src/index.js
[traverse] tree -- src/components
[traverse] blob -- src/components/Header.jsx
[traverse] tree -- src/components/ui
[traverse] blob -- src/components/ui/Button.tsx
[traverse] blob -- src/components/ui/Modal.tsx

[traverse] blob -- LICENSE.txt


 */