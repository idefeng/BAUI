import type { Meta, StoryObj } from '@storybook/react';

import { AutoComplete } from './auto-complete';

const projectOptions = [
  { label: '食品安全管理员项目', value: 'food-safety', description: '企业食品安全负责人培训' },
  { label: '继续医学教育项目', value: 'cme', description: '医务人员年度继续教育' },
  { label: '睡眠技师项目', value: 'sleep-technician', description: '睡眠监测与干预技能' },
];

const meta = {
  title: 'UI/AutoComplete',
  component: AutoComplete,
  tags: ['autodocs'],
  args: {
    'aria-label': '搜索培训项目',
    options: projectOptions,
    placeholder: '搜索项目名称',
  },
} satisfies Meta<typeof AutoComplete>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const MockProjectSearch: Story = {
  args: {
    mock: true,
    options: undefined,
    placeholder: '输入项目关键词',
  },
};
