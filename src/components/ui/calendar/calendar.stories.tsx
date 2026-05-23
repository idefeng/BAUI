import type { Meta, StoryObj } from '@storybook/react';

import { Calendar } from './calendar';

const meta = {
  title: 'UI/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {
    value: new Date(2026, 4, 22),
    mock: true,
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const TrainingSchedule: Story = {
  args: {
    events: [
      { date: '2026-05-15', title: '开班审核', status: 'primary' },
      { date: '2026-05-18', title: '线下实训', status: 'success' },
      { date: '2026-05-21', title: '资料补交', status: 'warning' },
    ],
  },
};
