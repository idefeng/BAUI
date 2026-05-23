import type { Meta, StoryObj } from '@storybook/react';

import { LearningProfile } from './learning-profile';

const meta = {
  title: 'Biz/LearningProfile',
  component: LearningProfile,
  tags: ['autodocs'],
  args: {
    studentId: 'student-it-001',
    mock: true,
    ba_training_project: 'ETLCHINA-2026-AI',
    ba_trainning_title: 'AI-AGENT-ENGINEER',
    ba_trainning_type: 'CONTINUING-EDUCATION',
    ba_region_scope: '440000',
  },
  argTypes: {
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
    layout: 'padded',
  },
} satisfies Meta<typeof LearningProfile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MockProfile: Story = {};

export const DarkMode: Story = {
  render: (args) => (
    <div className="dark rounded-3xl bg-background-dark p-6">
      <LearningProfile {...args} />
    </div>
  ),
};
