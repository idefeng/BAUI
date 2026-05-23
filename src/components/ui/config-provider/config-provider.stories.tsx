import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { ConfigProvider } from './config-provider';

const meta = {
  title: 'UI/ConfigProvider',
  component: ConfigProvider,
  tags: ['autodocs'],
  args: {
    theme: 'light',
    size: 'middle',
    locale: 'zh-CN',
    children: (
      <div className="rounded-2xl bg-background p-6 dark:bg-background-dark">
        <Button>保存配置</Button>
      </div>
    ),
  },
} satisfies Meta<typeof ConfigProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Dark: Story = {
  args: {
    theme: 'dark',
  },
};
