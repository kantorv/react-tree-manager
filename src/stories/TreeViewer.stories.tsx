import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { TreeViewer } from '..';

export default {
  title: 'Viewer/Main',
  component: TreeViewer,
  argTypes: {},
} as Meta<typeof TreeViewer>;

const Template: StoryFn<typeof TreeViewer> = (args) => <TreeViewer {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  text: 'Tree View Test',
};
