import type { Meta, StoryObj } from '@storybook/react';

// import { Button } from '@mui/material';
import { Button } from '../components/ui/Button.component';

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Button>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => (
    <Button sx={{ background: '#ff0' }} label="blabla">
      Button
    </Button>
  ),
};

export const Secondary: Story = {
  render: () => (
    <Button sx={{ background: '#ff0' }} label="hello">
      😄👍😍💯
    </Button>
  ),
};

export const Tertiary: Story = {
  render: () => (
    <Button sx={{ background: '#ff0' }} label="eeeee">
      📚📕📈🤓
    </Button>
  ),
};

export const WithLabel: Story = {
  args: {
    variant: 'contained',
    label: 'Hello',
  },
  render: (args) => <Button sx={{ background: '#ff0' }} {...args} />,
};
