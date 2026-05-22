import type { Meta, StoryObj } from '@storybook/react';

import { DashboardTemplate } from './DashboardTemplate';

const meta = {
  title: 'Biz/Pages/DashboardTemplate',
  component: DashboardTemplate,
  tags: ['autodocs'],
  args: {
    mock: true,
  },
  argTypes: {
    mock: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DashboardTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MockDashboard: Story = {};

export const DarkMode: Story = {
  render: (args) => (
    <div className="dark">
      <DashboardTemplate {...args} />
    </div>
  ),
};
