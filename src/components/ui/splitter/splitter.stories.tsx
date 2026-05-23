import type { Meta, StoryObj } from '@storybook/react';

import { Splitter } from './splitter';

const paneClass = 'rounded-xl bg-secondary p-4 text-sm text-secondary-foreground dark:bg-secondary-dark dark:text-secondary-dark-foreground';

const meta = {
  title: 'UI/Splitter',
  component: Splitter,
  tags: ['autodocs'],
  args: {
    defaultSizes: [35, 65],
    className: 'h-72',
    children: (
      <>
        <section className={paneClass}>项目列表</section>
        <section className={paneClass}>项目详情与审核记录</section>
      </>
    ),
  },
} satisfies Meta<typeof Splitter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    defaultSizes: [45, 55],
    children: (
      <>
        <section className={paneClass}>项目资料</section>
        <section className={paneClass}>处理日志</section>
      </>
    ),
  },
};
