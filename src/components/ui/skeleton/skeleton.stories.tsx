import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    className: 'h-4 w-64',
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => <Skeleton {...args} />,
};

export const Shapes: Story = {
  render: () => (
    <div className="w-80 space-y-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  ),
};

export const SmartTableLoading: Story = {
  render: () => (
    <div className="w-[560px] rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-[1.4fr_1fr_0.8fr] gap-4">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark w-80 rounded-2xl bg-background-dark p-6">
      <div className="flex items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  ),
};

export const MockModeDemo: Story = {
  render: () => (
    <div className="w-[620px] rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
      <div className="mb-4 grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-4">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] gap-4">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        ))}
      </div>
    </div>
  ),
};
