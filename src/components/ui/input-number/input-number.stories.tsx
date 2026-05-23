import type { Meta, StoryObj } from '@storybook/react';

import { InputNumber } from './input-number';

const meta = {
  title: 'UI/InputNumber',
  component: InputNumber,
  tags: ['autodocs'],
  args: {
    'aria-label': '培训人数',
    defaultValue: 128,
    min: 0,
    max: 500,
    step: 5,
  },
  argTypes: {
    mock: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof InputNumber>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const CourseHours: Story = {
  args: {
    'aria-label': '课程学时',
    defaultValue: 24,
    min: 1,
    max: 120,
    step: 1,
  },
};

export const MockValue: Story = {
  args: {
    'aria-label': '报名人数',
    defaultValue: undefined,
    mock: true,
  },
};
