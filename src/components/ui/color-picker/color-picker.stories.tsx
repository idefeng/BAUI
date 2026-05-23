import type { Meta, StoryObj } from '@storybook/react';

import { ColorPicker } from './color-picker';

const meta = {
  title: 'UI/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  args: {
    'aria-label': '品牌主题色',
    presets: [
      { label: '科技蓝', value: 'hsl(218 100% 43%)' },
      { label: '成功绿', value: 'hsl(167 66% 44%)' },
      { label: '警示橙', value: 'hsl(32 95% 44%)' },
    ],
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const MockPalette: Story = {
  args: {
    mock: true,
    presets: undefined,
  },
};
