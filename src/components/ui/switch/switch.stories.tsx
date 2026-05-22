import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from './switch';

const meta = {
  title: 'UI/Switch',
  component: Switch,
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
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Switch id="switch-basic" aria-label="启用通知" {...args} />
      <label htmlFor="switch-basic" className="text-sm font-medium text-foreground dark:text-foreground-dark">
        启用通知
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
      <Switch id="switch-checked" aria-label="自动同步" {...args} />
      <label htmlFor="switch-checked" className="text-sm font-medium text-foreground dark:text-foreground-dark">
        自动同步
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
      <Switch id="switch-disabled" aria-label="系统锁定" {...args} />
      <label htmlFor="switch-disabled" className="text-sm font-medium text-disabled-foreground dark:text-disabled-dark-foreground">
        系统锁定
      </label>
    </div>
  ),
};

export const DarkContrast: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background-dark p-6 text-foreground-dark">
      <div className="flex items-center gap-3">
        <Switch id="switch-dark" aria-label="暗黑模式高对比" defaultChecked />
        <label htmlFor="switch-dark" className="text-sm font-medium">
          暗黑模式高对比
        </label>
      </div>
    </div>
  ),
};
