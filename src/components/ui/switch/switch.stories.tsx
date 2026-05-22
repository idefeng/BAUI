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

export const MockModeDemo: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-6">
        <label htmlFor="mock-auto-enroll" className="text-sm font-medium text-foreground dark:text-foreground-dark">
          新从业人员自动加入住建项目
        </label>
        <Switch id="mock-auto-enroll" aria-label="新从业人员自动加入住建项目" defaultChecked />
      </div>
      <div className="flex items-center justify-between gap-6">
        <label htmlFor="mock-course-alert" className="text-sm font-medium text-foreground dark:text-foreground-dark">
          项目状态变更短信通知
        </label>
        <Switch id="mock-course-alert" aria-label="项目状态变更短信通知" />
      </div>
    </div>
  ),
};
