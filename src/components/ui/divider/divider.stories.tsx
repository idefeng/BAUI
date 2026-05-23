import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Divider } from './divider';

const meta = {
  title: 'UI/Divider',
  component: Divider,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    textAlign: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithText: Story = {
  args: {
    children: '项目资料',
  },
};

export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center rounded-2xl border border-border bg-surface p-3 dark:border-border-dark dark:bg-surface-dark">
      <Button size="sm" variant="ghost">
        编辑
      </Button>
      <Divider orientation="vertical" />
      <Button size="sm" variant="ghost">
        导出
      </Button>
      <Divider orientation="vertical" />
      <Button size="sm" variant="ghost">
        归档
      </Button>
    </div>
  ),
};
