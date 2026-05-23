import type { Meta, StoryObj } from '@storybook/react';

import { Mentions } from './mentions';

const meta = {
  title: 'UI/Mentions',
  component: Mentions,
  tags: ['autodocs'],
  args: {
    'aria-label': '审核意见',
    placeholder: '输入 @ 可提及项目成员',
    options: [
      { label: '林予安', value: 'lin-yuan', description: '食品安全管理员项目 / 教务复核' },
      { label: '周明轩', value: 'zhou-mingxuan', description: '继续医学教育项目 / 项目负责人' },
      { label: '陈晓雨', value: 'chen-xiaoyu', description: '证书服务组 / 签发支持' },
    ],
  },
} satisfies Meta<typeof Mentions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const MockPeople: Story = {
  args: {
    mock: true,
    options: undefined,
  },
};
