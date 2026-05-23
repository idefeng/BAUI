import type { Meta, StoryObj } from '@storybook/react';

import { boaoIconSet, BoaoCourseIcon } from './icons';

const meta = {
  title: 'UI/Icons',
  component: BoaoCourseIcon,
  tags: ['autodocs'],
  args: {
    size: 64,
    strokeWidth: 3.5,
  },
  argTypes: {
    accentClassName: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
    size: {
      control: { type: 'number', min: 24, max: 96, step: 4 },
    },
    strokeWidth: {
      control: { type: 'number', min: 2, max: 5, step: 0.5 },
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof BoaoCourseIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  render: (args) => (
    <div className="grid gap-6 rounded-3xl border border-border bg-background p-6 dark:border-border-dark dark:bg-background-dark">
      <div>
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark">ETLCHINA 企业业务图标</h3>
        <p className="mt-2 text-sm text-muted-foreground dark:text-muted-dark-foreground">
          统一圆角线性风格，主色跟随 currentColor，强调色默认使用 success 语义 token。
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {boaoIconSet.map(({ Icon, label, name }) => (
          <div
            key={name}
            className="flex min-h-44 flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-surface p-5 shadow-button dark:border-border-dark dark:bg-surface-dark"
          >
            <Icon {...args} title={label} />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground dark:text-foreground-dark">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground dark:text-muted-dark-foreground">{name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Monochrome: Story = {
  args: {
    accentClassName: 'text-primary dark:text-primary-dark',
    className: 'text-primary dark:text-primary-dark',
  },
  render: (args) => (
    <div className="grid gap-4 rounded-3xl border border-border bg-surface p-6 dark:border-border-dark dark:bg-surface-dark sm:grid-cols-4">
      {boaoIconSet.map(({ Icon, label, name }) => (
        <div key={name} className="flex flex-col items-center gap-3 rounded-2xl bg-secondary p-4 dark:bg-secondary-dark">
          <Icon {...args} title={label} />
          <span className="text-xs font-medium text-muted-foreground dark:text-muted-dark-foreground">{label}</span>
        </div>
      ))}
    </div>
  ),
};
