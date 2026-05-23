import type { Meta, StoryObj } from '@storybook/react';

import { Watermark } from './watermark';

const meta = {
  title: 'UI/Watermark',
  component: Watermark,
  tags: ['autodocs'],
  args: {
    content: '内部资料',
    children: (
      <div className="space-y-3 p-8 text-foreground dark:text-foreground-dark">
        <h3 className="text-lg font-semibold">食品安全管理员项目证书预览</h3>
        <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
          学员：林予安；证书编号：ETLCHINA-2026-0522
        </p>
      </div>
    ),
  },
} satisfies Meta<typeof Watermark>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const MockPreview: Story = {
  args: {
    content: undefined,
    mock: true,
  },
};
