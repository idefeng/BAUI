import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '../avatar';
import { Badge, BadgeDot } from './badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: '进行中',
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'success', 'warning', 'error', 'gray'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="primary">进行中</Badge>
      <Badge variant="success">已通过</Badge>
      <Badge variant="warning">待审核</Badge>
      <Badge variant="error">未通过</Badge>
      <Badge variant="gray">草稿</Badge>
    </div>
  ),
};

export const DotMode: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <BadgeDot label="学员有未读消息">
        <Avatar name="陈晓雨" mock size="lg" />
      </BadgeDot>
      <BadgeDot label="无未读消息" show={false}>
        <Avatar name="赵一诺" size="lg" />
      </BadgeDot>
    </div>
  ),
};
