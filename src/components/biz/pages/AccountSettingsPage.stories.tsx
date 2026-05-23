import type { Meta, StoryObj } from '@storybook/react';

import { AccountSettingsPage } from './AccountSettingsPage';

const meta = {
  title: 'Biz/Pages/AccountSettingsPage',
  component: AccountSettingsPage,
  tags: ['autodocs'],
  args: {
    mock: true,
    ba_training_project: 'ETLCHINA-2026-AI',
    ba_trainning_title: 'AI-AGENT-ENGINEER',
    ba_trainning_type: 'CONTINUING-EDUCATION',
    ba_region_scope: '440000',
  },
  argTypes: {
    mock: {
      control: 'boolean',
    },
    ba_training_project: {
      control: 'text',
    },
    ba_trainning_title: {
      control: 'text',
    },
    ba_trainning_type: {
      control: 'text',
    },
    ba_region_scope: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AccountSettingsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MockSettings: Story = {};

export const DarkMode: Story = {
  render: (args) => (
    <div className="dark">
      <AccountSettingsPage {...args} />
    </div>
  ),
};
