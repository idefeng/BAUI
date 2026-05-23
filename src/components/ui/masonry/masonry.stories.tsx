import type { Meta, StoryObj } from '@storybook/react';

import { Masonry } from './masonry';

const cardClass = 'mb-4 rounded-2xl border border-border bg-surface p-4 text-sm shadow-button dark:border-border-dark dark:bg-surface-dark';

const meta = {
  title: 'UI/Masonry',
  component: Masonry,
  tags: ['autodocs'],
  args: {
    columns: 3,
    gap: 16,
    children: (
      <>
        <article className={cardClass}>项目概览</article>
        <article className={cardClass}>证书签发进度<br />待处理 18 项</article>
        <article className={cardClass}>学员学习档案<br />本周新增 1286 人<br />完课率 86.4%</article>
      </>
    ),
  },
} satisfies Meta<typeof Masonry>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
