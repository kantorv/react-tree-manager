import * as React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
import { TreeEditor } from "..";



const meta: Meta<typeof TreeEditor> = {
	component: TreeEditor,
};

export default meta;
type Story = StoryObj<typeof TreeEditor>;

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
		<TreeEditor />

	</Box>

};
