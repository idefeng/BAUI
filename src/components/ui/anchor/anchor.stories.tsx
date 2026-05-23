import type { Meta, StoryObj } from '@storybook/react';

import { Anchor } from './anchor';

const items = [
  { title: '项目概览', href: '#overview' },
  { title: '学员名单', href: '#learners' },
  { title: '证书记录', href: '#certificates' },
];

const meta = {
  title: 'UI/Anchor',
  component: Anchor,
  tags: ['autodocs'],
  args: {
    items,
    activeHref: '#learners',
  },
} satisfies Meta<typeof Anchor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Nested: Story = {
  args: {
    activeHref: '#audit',
    items: [
      { title: '项目概览', href: '#overview' },
      {
        title: '资料管理',
        href: '#materials',
        children: [
          { title: '学员资料', href: '#learners' },
          { title: '审核记录', href: '#audit' },
        ],
      },
    ],
  },
};
