import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Download, Plus, Send } from 'lucide-react';

import { mockProjects } from '../../../utils/mock';
import { Button } from './button';

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: '按钮',
    size: 'md',
    variant: 'solid',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['solid', 'outline', 'ghost'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: {
    children: '创建项目',
    leftIcon: <Plus />,
  },
};

export const Outline: Story = {
  args: {
    children: '导出数据',
    leftIcon: <Download />,
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: '查看详情',
    rightIcon: <ArrowRight />,
    variant: 'ghost',
  },
};

export const Loading: Story = {
  args: {
    children: '正在提交',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: '暂不可用',
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: '发送通知',
    leftIcon: <Send />,
    rightIcon: <ArrowRight />,
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button leftIcon={<Plus />}>实色按钮</Button>
      <Button variant="outline" leftIcon={<Download />}>
        线框按钮
      </Button>
      <Button variant="ghost" rightIcon={<ArrowRight />}>
        文本按钮
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">小按钮</Button>
      <Button size="md">中按钮</Button>
      <Button size="lg">大按钮</Button>
    </div>
  ),
};

export const MockModeDemo: Story = {
  render: () => {
    const [project] = mockProjects(1);

    return (
      <div className="flex flex-wrap items-center gap-3">
        <Button leftIcon={<Plus />}>启动{project.projectName}</Button>
        <Button variant="outline" leftIcon={<Download />}>
          导出从业人员名单
        </Button>
        <Button variant="ghost" rightIcon={<ArrowRight />}>
          查看项目详情
        </Button>
      </div>
    );
  },
};
