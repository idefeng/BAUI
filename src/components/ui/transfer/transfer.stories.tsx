import type { Meta, StoryObj } from '@storybook/react';

import { Transfer } from './transfer';

const dataSource = [
  { key: 'u1', title: '林予安', description: '食品安全管理员项目 / 教务复核' },
  { key: 'u2', title: '周明轩', description: '继续医学教育项目 / 项目负责人' },
  { key: 'u3', title: '陈晓雨', description: '证书服务组 / 签发支持' },
  { key: 'u4', title: '宋佳宁', description: '学习服务组 / 班主任' },
  { key: 'u5', title: '何以辰', description: '项目运营组 / 数据复核' },
];

const meta = {
  title: 'UI/Transfer',
  component: Transfer,
  tags: ['autodocs'],
  args: {
    dataSource,
    defaultTargetKeys: ['u3'],
    titles: ['候选人员', '已分配人员'],
  },
} satisfies Meta<typeof Transfer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const MockCandidates: Story = {
  args: {
    mock: true,
    dataSource: undefined,
    defaultTargetKeys: [],
  },
};

export const DragSelect: Story = {
  args: {
    dragSelect: true,
    defaultTargetKeys: [],
  },
};

export const PanelSelection: Story = {
  args: {
    defaultTargetKeys: [],
    titles: ['待分配人员', '已分配人员'],
  },
};
