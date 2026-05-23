import type { Meta, StoryObj } from '@storybook/react';

import { Tour } from './tour';

const meta = {
  title: 'UI/Tour',
  component: Tour,
  tags: ['autodocs'],
  args: {
    open: true,
    steps: [
      { title: '查看项目列表', description: '从这里进入项目详情页。' },
      { title: '处理审核任务', description: '在这里完成资料复核。' },
    ],
  },
} satisfies Meta<typeof Tour>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
