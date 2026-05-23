import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Empty } from './empty';

const meta = {
  title: 'UI/Empty',
  component: Empty,
  tags: ['autodocs'],
  args: {
    mock: false,
  },
  argTypes: {
    mock: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const ProjectEmpty: Story = {
  args: {
    mock: true,
    action: <Button size="sm">新建项目</Button>,
  },
};
