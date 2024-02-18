import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@mui/material';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Button sx={{ background: '#ff0' }}>Button</Button>,
};

export const Secondary: Story = {
  render: () => <Button sx={{ background: '#ff0' }}>😄👍😍💯</Button>,
};

export const Tertiary: Story = {
  render: () => <Button sx={{ background: '#ff0' }}>📚📕📈🤓</Button>,
};
