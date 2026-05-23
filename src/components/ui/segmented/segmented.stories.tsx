import type { Meta, StoryObj } from '@storybook/react';

import { Segmented } from './segmented';

const meta = {
  title: 'UI/Segmented',
  component: Segmented,
  tags: ['autodocs'],
  args: {
    defaultValue: 'active',
    options: [
      { label: '全部', value: 'all' },
      { label: '进行中', value: 'active' },
      { label: '待审核', value: 'pending' },
      { label: '已结项', value: 'done' },
    ],
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Segmented>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithDisabled: Story = {
  args: {
    options: [
      { label: '日', value: 'day' },
      { label: '周', value: 'week' },
      { label: '月', value: 'month' },
      { label: '年', value: 'year', disabled: true },
    ],
    defaultValue: 'week',
  },
};
