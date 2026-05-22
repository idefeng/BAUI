import type { Meta, StoryObj } from '@storybook/react';

import { LearningProfile } from './learning-profile';

const meta = {
  title: 'Biz/LearningProfile',
  component: LearningProfile,
  tags: ['autodocs'],
  args: {
    studentId: 'student-it-001',
    mock: true,
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
