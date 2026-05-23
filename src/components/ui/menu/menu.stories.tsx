import type { Meta, StoryObj } from '@storybook/react';
import { FolderKanban, Home, Settings } from 'lucide-react';

import { Menu } from './menu';

const items = [
  { key: 'dashboard', label: '工作台', icon: <Home /> },
  {
    key: 'projects',
    label: '项目管理',
    icon: <FolderKanban />,
    children: [
      { key: 'active-projects', label: '进行中项目' },
      { key: 'archived-projects', label: '归档项目' },
    ],
  },
  { key: 'settings', label: '系统设置', icon: <Settings /> },
];

const meta = {
  title: 'UI/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: {
    items,
    defaultSelectedKey: 'active-projects',
    defaultOpenKeys: ['projects'],
  },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
