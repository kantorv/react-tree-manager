import * as React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { TreeViewer } from "..";



const meta: Meta<typeof TreeViewer> = {
	component: TreeViewer,
};

export default meta;
type Story = StoryObj<typeof TreeViewer>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */



export const Single: Story = {
	render: () => <Box
		sx={{
			background: "yellow",
			maxWidth: "500px",
			p: 1
		}}
	>
		<TreeViewer />

	</Box>

};
