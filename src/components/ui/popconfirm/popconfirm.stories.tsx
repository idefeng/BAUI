import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Space } from '../space';
import { Popconfirm } from './popconfirm';

const meta = {
  title: 'UI/Popconfirm',
  component: Popconfirm,
  tags: ['autodocs'],
  args: {
    title: '归档项目',
    description: '归档后项目将从当前列表移入历史项目。',
  },
} satisfies Meta<typeof Popconfirm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    children: <Button variant="outline">归档项目</Button>,
  },
  render: (args) => (
    <Popconfirm {...args}>
      {args.children}
    </Popconfirm>
  ),
};

export const Danger: Story = {
  args: {
    children: <Button variant="outline">删除项目</Button>,
    title: '删除项目',
  },
  render: () => (
    <Space>
      <Popconfirm title="删除项目" description="删除后不可恢复，请确认没有未完成证书。" okText="删除" okVariant="danger">
        <Button variant="outline">删除项目</Button>
      </Popconfirm>
      <Popconfirm title="撤回审核" description="撤回后项目负责人需要重新提交资料。">
        <Button variant="ghost">撤回审核</Button>
      </Popconfirm>
    </Space>
  ),
};
