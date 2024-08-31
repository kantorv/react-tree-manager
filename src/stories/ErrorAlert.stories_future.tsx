import * as React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "@mui/material";
//import {  ErrorAlert } from "..";
import  { default as ErrorAlert } from "../lib/components/alerts/ErrorAlert";
 



const meta: Meta<typeof ErrorAlert> = {
	component: ErrorAlert,
};

export default meta;
type Story = StoryObj<typeof ErrorAlert>;

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
		<ErrorAlert />

	</Box>

};
