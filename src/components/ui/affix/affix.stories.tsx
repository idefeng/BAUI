import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Affix } from './affix';

const meta = {
  title: 'UI/Affix',
  component: Affix,
  tags: ['autodocs'],
  args: {
    offsetTop: 16,
    children: <Button>保存草稿</Button>,
  },
} satisfies Meta<typeof Affix>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const BottomActions: Story = {
  args: {
    offsetBottom: 16,
    children: (
      <div className="rounded-2xl border border-border bg-surface p-3 shadow-button dark:border-border-dark dark:bg-surface-dark">
        <Button>批量提交</Button>
      </div>
    ),
  },
};
