import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AtSign, Calendar, Search } from 'lucide-react';

import { Input } from './input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: '请输入内容',
  },
  argTypes: {
    clearable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    'aria-label': '基础输入框',
    placeholder: '请输入项目名称',
  },
};

export const WithIcons: Story = {
  args: {
    'aria-label': '搜索项目',
    placeholder: '搜索项目或成员',
    prefixIcon: <Search />,
    suffixIcon: <Calendar />,
  },
};

export const Clearable: Story = {
  render: () => {
    const [value, setValue] = React.useState('博鳌智能组件库');

    return (
      <Input
        aria-label="可清除输入框"
        clearable
        prefixIcon={<AtSign />}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        onClear={() => setValue('')}
        placeholder="请输入名称"
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    'aria-label': '禁用输入框',
    clearable: true,
    disabled: true,
    defaultValue: '不可编辑内容',
  },
};

export const MockModeDemo: Story = {
  render: () => (
    <div className="grid w-full max-w-2xl gap-4 md:grid-cols-3">
      <Input aria-label="从业人员姓名" mock="name" clearable />
      <Input aria-label="联系电话" mock="phone" clearable />
      <Input aria-label="企业邮箱" mock="email" clearable />
    </div>
  ),
};
