import * as React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { TreeViewerNext } from "..";


const sample3: TreeNode[] = [
	{
	  type: 'blob',
	  path: 'q11.md',
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
