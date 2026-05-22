import type { Meta, StoryObj } from '@storybook/react';
import { Info } from 'lucide-react';

import { Button } from '../button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const meta = {
  title: 'UI/Tooltip',
  component: TooltipContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={120}>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof TooltipContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-colors hover:text-foreground dark:border-border-dark dark:bg-surface-dark dark:text-muted-dark-foreground dark:hover:text-foreground-dark"
          aria-label="查看说明"
        >
          <Info className="size-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent>字段会在保存后同步到业务表格。</TooltipContent>
    </Tooltip>
  ),
};

export const WithButton: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">查看风险</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">该操作会影响 SmartTable 中已选中的批量数据。</TooltipContent>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>复杂业务说明</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-80" side="right">
        用于解释字段来源、计算口径或状态限制，避免在表格单元格里堆放过多文字。
      </TooltipContent>
    </Tooltip>
  ),
};

export const Opened: Story = {
  render: () => (
    <Tooltip open>
      <TooltipTrigger asChild>
        <Button variant="outline">常开提示</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">这个用例用于文档审查和视觉回归检查。</TooltipContent>
    </Tooltip>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background-dark p-8 text-foreground-dark">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">暗黑提示</Button>
        </TooltipTrigger>
        <TooltipContent side="top">暗黑模式下保留边框和轻微阴影。</TooltipContent>
      </Tooltip>
    </div>
  ),
};
