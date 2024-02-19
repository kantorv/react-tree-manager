import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { TreeView } from '..';

export default {
  title: 'Main/TreeEditor',
  component: TreeView,
  argTypes: {},
} as Meta<typeof TreeView>;

const Template: StoryFn<typeof TreeView> = (args) => <TreeView {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  text: 'Tree View Test',
};
