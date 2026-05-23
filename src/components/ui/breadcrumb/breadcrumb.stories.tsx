import type { Meta, StoryObj } from '@storybook/react';
import { FolderOpen } from 'lucide-react';

import { Breadcrumb } from './breadcrumb';

const meta = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    items: [
      { title: '首页', href: '/' },
      { title: '培训项目', href: '/projects' },
      { title: '食品安全管理员项目' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithIcon: Story = {
  args: {
    items: [
      { title: '控制台', href: '/' },
      { title: '证书管理', href: '/certificates', icon: <FolderOpen className="size-4" aria-hidden="true" /> },
      { title: '证书详情' },
    ],
  },
};
