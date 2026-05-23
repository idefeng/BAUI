import type { Meta, StoryObj } from '@storybook/react';

import { Rate } from './rate';

const meta = {
  title: 'UI/Rate',
  component: Rate,
  tags: ['autodocs'],
  args: {
    'aria-label': '课程满意度',
    defaultValue: 4,
  },
} satisfies Meta<typeof Rate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 3,
  },
};

export const MockValue: Story = {
  args: {
    mock: true,
    defaultValue: undefined,
  },
};
