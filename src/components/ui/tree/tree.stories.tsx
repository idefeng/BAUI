import type { Meta, StoryObj } from '@storybook/react';

import { Tree } from './tree';

const data = [
  {
    title: '技术中心',
    key: 'tech',
    children: [
      { title: '前端组', key: 'frontend' },
      { title: '后端组', key: 'backend' },
    ],
  },
  {
    title: '运营中心',
    key: 'ops',
    children: [
      { title: '培训运营组', key: 'training-ops' },
      { title: '证书归档组', key: 'certificate-archive' },
    ],
  },
];

const meta = {
  title: 'UI/Tree',
  component: Tree,
  tags: ['autodocs'],
  args: {
    data,
    defaultExpandedKeys: ['tech'],
  },
} satisfies Meta<typeof Tree>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Selected: Story = {
  args: {
    defaultExpandedKeys: ['tech', 'ops'],
    defaultSelectedKey: 'training-ops',
  },
};
