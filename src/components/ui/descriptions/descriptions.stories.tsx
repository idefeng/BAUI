import type { Meta, StoryObj } from '@storybook/react';

import { Descriptions } from './descriptions';

const items = [
  { label: '项目名称', children: '食品安全管理员项目' },
  { label: '培训类型', children: '专项能力提升' },
  { label: '负责人', children: '李老师' },
  { label: '报名人数', children: '128 人' },
  { label: '开班时间', children: '2026-05-24 14:45' },
  { label: '承训机构', children: '博奥继续教育中心', span: 2 },
];

const meta = {
  title: 'UI/Descriptions',
  component: Descriptions,
  tags: ['autodocs'],
  args: {
    title: '项目基础信息',
    items,
    column: 3,
  },
  argTypes: {
    column: {
      control: { type: 'number', min: 1, max: 4 },
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Descriptions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Bordered: Story = {
  args: {
    bordered: true,
  },
};
