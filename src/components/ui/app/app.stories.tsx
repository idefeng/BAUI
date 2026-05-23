import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Menu } from '../menu';
import { App } from './app';

const meta = {
  title: 'UI/App',
  component: App,
  tags: ['autodocs'],
  args: {
    title: 'BOAO 管理后台',
    navigation: (
      <Menu
        items={[
          { key: 'dashboard', label: '工作台' },
          { key: 'projects', label: '项目管理' },
        ]}
        defaultSelectedKey="dashboard"
      />
    ),
    actions: <Button>新建项目</Button>,
    children: (
      <section className="rounded-2xl border border-border bg-surface p-6 dark:border-border-dark dark:bg-surface-dark">
        项目工作台
      </section>
    ),
  },
} satisfies Meta<typeof App>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
