import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Tag } from '../tag';
import { Space } from './space';

const meta = {
  title: 'UI/Space',
  component: Space,
  tags: ['autodocs'],
  args: {
    direction: 'horizontal',
    size: 'md',
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
    },
  },
} satisfies Meta<typeof Space>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Actions: Story = {
  render: (args) => (
    <Space {...args}>
      <Button size="sm">新建项目</Button>
      <Button size="sm" variant="outline">
        导入名单
      </Button>
      <Button size="sm" variant="ghost">
        导出
      </Button>
    </Space>
  ),
};

export const TagWrap: Story = {
  render: () => (
    <Space wrap className="w-[420px]">
      <Tag>食品安全管理员</Tag>
      <Tag variant="success">继续医学教育</Tag>
      <Tag variant="warning">睡眠技师</Tag>
      <Tag variant="gray">公共营养师</Tag>
    </Space>
  ),
};
