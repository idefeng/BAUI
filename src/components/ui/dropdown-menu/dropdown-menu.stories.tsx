import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Archive, Copy, Download, MoreHorizontal, Pencil, Settings, Trash2 } from 'lucide-react';

import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>更多操作</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>项目操作</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<Pencil />}>编辑项目</DropdownMenuItem>
        <DropdownMenuItem icon={<Copy />}>复制链接</DropdownMenuItem>
        <DropdownMenuItem icon={<Archive />}>归档项目</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<Trash2 />} variant="danger">
          删除项目
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithButtonTrigger: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild styled={false}>
        <Button variant="outline" rightIcon={<MoreHorizontal />}>
          操作
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem icon={<Download />}>
          导出
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem icon={<Settings />}>
          设置
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>更多</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>生成报告</DropdownMenuItem>
            <DropdownMenuItem>同步权限</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Stateful: Story = {
  render: () => {
    const [showArchived, setShowArchived] = React.useState(false);
    const [density, setDensity] = React.useState('comfortable');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger>视图配置</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>显示字段</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>
            包含归档数据
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>表格密度</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
            <DropdownMenuRadioItem value="compact">紧凑</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="comfortable">舒适</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="spacious">宽松</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem inset>保存为默认视图</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
};
