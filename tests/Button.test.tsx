import React from 'react';
import renderer from 'react-test-renderer';
import { expect, it } from 'vitest';
import { Button } from '@mui/material';

it('renders correctly', () => {
  const tree = renderer
    .create(
      <Button onClick={() => console.log('test button clicked')}>
        TestButton
      </Button>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
