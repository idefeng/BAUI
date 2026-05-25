import type { Meta, StoryObj } from '@storybook/react';

import { DemoStudio } from './demo-studio';

const meta = {
  title: 'Biz/DemoStudio/DemoStudio',
  component: DemoStudio,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DemoStudio>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 极低代码演示装配控制台：支持左侧可视化参数选择，右侧高保真演示系统沙箱联调 */
export const InteractiveStudio: Story = {};
