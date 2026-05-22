import type { Meta, StoryObj } from '@storybook/react';

import { mockUsers } from '../../../utils/mock';
import { Checkbox, CheckboxGroup } from './checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    defaultChecked: false,
    disabled: false,
  },
  argTypes: {
    defaultChecked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Checkbox id="checkbox-basic" aria-label="同意协议" {...args} />
      <label htmlFor="checkbox-basic" className="text-sm font-medium text-foreground dark:text-foreground-dark">
        同意协议
      </label>
    </div>
  ),
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Checkbox id="checkbox-checked" aria-label="接收通知" {...args} />
      <label htmlFor="checkbox-checked" className="text-sm font-medium text-foreground dark:text-foreground-dark">
        接收通知
      </label>
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    defaultChecked: 'indeterminate',
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Checkbox id="checkbox-indeterminate" aria-label="部分选择" {...args} />
      <label htmlFor="checkbox-indeterminate" className="text-sm font-medium text-foreground dark:text-foreground-dark">
        部分选择
      </label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Checkbox id="checkbox-disabled" aria-label="已锁定" {...args} />
      <label htmlFor="checkbox-disabled" className="text-sm font-medium text-disabled-foreground dark:text-disabled-dark-foreground">
        已锁定
      </label>
    </div>
  ),
};

export const DarkContrast: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background-dark p-6 text-foreground-dark">
      <div className="flex items-center gap-3">
        <Checkbox id="checkbox-dark" aria-label="暗黑模式勾选态" defaultChecked />
        <label htmlFor="checkbox-dark" className="text-sm font-medium">
          暗黑模式勾选态
        </label>
      </div>
    </div>
  ),
};

export const MockModeDemo: Story = {
  render: () => {
    const users = mockUsers(3);

    return (
      <div className="grid gap-3">
        {users.map((user, index) => (
          <div key={user.id} className="flex items-center gap-3">
            <Checkbox id={`mock-user-${user.id}`} aria-label={`选择 ${user.name}`} defaultChecked={index === 0} />
            <label htmlFor={`mock-user-${user.id}`} className="text-sm font-medium text-foreground dark:text-foreground-dark">
              {user.name} · {user.workUnit}
            </label>
          </div>
        ))}
      </div>
    );
  },
};

export const Group: Story = {
  render: () => (
    <CheckboxGroup
      aria-label="感兴趣的 IT 技术"
      mock
      defaultValue={['frontend', 'ai-agent']}
    />
  ),
};
