import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Flex } from './flex';

const meta = {
  title: 'UI/Flex',
  component: Flex,
  tags: ['autodocs'],
  args: {
    gap: 'md',
    justify: 'start',
    align: 'center',
  },
  argTypes: {
    gap: { control: 'inline-radio', options: ['none', 'xs', 'sm', 'md', 'lg'] },
    justify: { control: 'inline-radio', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end', 'baseline', 'stretch'] },
  },
} satisfies Meta<typeof Flex>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Toolbar: Story = {
  render: (args) => (
    <Flex {...args}>
      <Button size="sm">新建项目</Button>
      <Button size="sm" variant="outline">导入名单</Button>
      <Button size="sm" variant="ghost">导出</Button>
    </Flex>
  ),
};

export const Vertical: Story = {
  args: {
    vertical: true,
    align: 'stretch',
  },
  render: (args) => (
    <Flex {...args} className="w-72 rounded-2xl border border-border p-4 dark:border-border-dark">
      <span className="font-semibold text-foreground dark:text-foreground-dark">项目资料</span>
      <span className="text-sm text-muted-foreground dark:text-muted-dark-foreground">按审核阶段组织表单区块。</span>
    </Flex>
  ),
};
