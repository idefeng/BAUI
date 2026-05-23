import type { Meta, StoryObj } from '@storybook/react';

import { BorderBeam } from './border-beam';

const meta = {
  title: 'UI/BorderBeam',
  component: BorderBeam,
  tags: ['autodocs'],
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-base font-semibold text-foreground dark:text-foreground-dark">BOAO 品牌入口</h3>
        <p className="mt-2 text-sm text-muted-foreground dark:text-muted-dark-foreground">
          用于突出少量重点动作或品牌展示块。
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof BorderBeam>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
