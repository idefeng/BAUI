import type { Meta, StoryObj } from '@storybook/react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'UI/Select',
  component: SelectTrigger,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SelectTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="w-72">
      <Select defaultValue="design">
        <SelectTrigger aria-label="选择规范分类">
          <SelectValue placeholder="请选择分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="design">设计规范</SelectItem>
          <SelectItem value="frontend">前端规范</SelectItem>
          <SelectItem value="backend">后端规范</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <div className="w-72">
      <Select>
        <SelectTrigger aria-label="选择组件状态">
          <SelectValue placeholder="请选择组件状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">草稿</SelectItem>
          <SelectItem value="review">评审中</SelectItem>
          <SelectItem value="released">已发布</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Grouped: Story = {
  render: () => (
    <div className="w-72">
      <Select defaultValue="button">
        <SelectTrigger aria-label="选择组件">
          <SelectValue placeholder="请选择组件" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>基础组件</SelectLabel>
            <SelectItem value="button">Button</SelectItem>
            <SelectItem value="input">Input</SelectItem>
            <SelectItem value="select">Select</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>反馈组件</SelectLabel>
            <SelectItem value="toast">Toast</SelectItem>
            <SelectItem value="dialog">Dialog</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <Select defaultValue="locked" disabled>
        <SelectTrigger aria-label="禁用选择器">
          <SelectValue placeholder="请选择" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="locked">已锁定</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const MockModeDemo: Story = {
  render: () => (
    <div className="grid w-full max-w-xl gap-4 md:grid-cols-2">
      <Select mock defaultValue="construction" />
      <Select mock mockType="trainingType" defaultValue="vocational-training" />
    </div>
  ),
};
