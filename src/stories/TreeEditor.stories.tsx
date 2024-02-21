import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import { TreeEditor } from '..';

export default {
  title: 'Editor/Main',
  component: TreeEditor,
  argTypes: {},
} as Meta<typeof TreeEditor>;

const Template: StoryFn<typeof TreeEditor> = (args) => <TreeEditor {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  text: 'Tree View Test',
};
