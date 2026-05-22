import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '../avatar';
import { Badge } from '../badge';
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from './popover';

const meta = {
  title: 'UI/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {
    triggerMode: 'click',
  },
  argTypes: {
    triggerMode: {
      control: 'inline-radio',
      options: ['click', 'hover'],
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LearningProfile: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <button type="button" className="rounded-full focus:outline-none">
          <Avatar mock size="lg" alt="林予安头像" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground dark:text-foreground-dark">林予安</p>
              <p className="text-xs text-muted-foreground dark:text-muted-dark-foreground">食品安全管理员项目</p>
            </div>
            <Badge variant="success">96%</Badge>
          </div>
          <div className="rounded-xl bg-secondary p-3 text-xs leading-5 text-secondary-foreground dark:bg-secondary-dark dark:text-secondary-dark-foreground">
            最近一次登录：今日 09:18；已完成 12/13 个学习任务。
          </div>
        </div>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  ),
};
