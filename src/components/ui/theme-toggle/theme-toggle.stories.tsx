import type { Meta, StoryObj } from '@storybook/react';
import { Bell, CheckCircle2, Search } from 'lucide-react';

import { Button } from '../button';
import { Input } from '../input';
import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'UI/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    showLabel: true,
  },
  argTypes: {
    defaultTheme: {
      control: 'inline-radio',
      options: ['light', 'dark'],
    },
    persist: {
      control: 'boolean',
    },
    showLabel: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="min-h-screen bg-background p-8 text-foreground transition-colors dark:bg-background-dark dark:text-foreground-dark">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground dark:text-foreground-dark">BOAO UI 主题预览</h1>
            <p className="mt-2 text-sm text-muted-foreground dark:text-muted-dark-foreground">
              点击右侧按钮后，Storybook 预览区会通过 html.dark 切换整套组件的暗黑样式。
            </p>
          </div>
          <ThemeToggle {...args} />
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-button dark:border-border-dark dark:bg-surface-dark">
            <div className="flex flex-col gap-4">
              <Input clearable prefixIcon={<Search />} placeholder="搜索项目、机构或负责人" />
              <div className="flex flex-wrap gap-3">
                <Button leftIcon={<CheckCircle2 />}>保存配置</Button>
                <Button variant="outline">导出数据</Button>
                <Button variant="ghost">查看详情</Button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-button dark:border-border-dark dark:bg-surface-dark">
            <div className="flex items-start gap-4">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-success-soft text-success dark:bg-success-dark-soft dark:text-success-dark">
                <Bell className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-foreground dark:text-foreground-dark">通知状态</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
                  primary、success 与表面色都会跟随暗黑模式切换，保证科技蓝在深色背景下依然清晰可读。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  ),
};

export const MockModeDemo: Story = {
  render: (args) => (
    <div className="min-h-screen bg-background p-8 text-foreground transition-colors dark:bg-background-dark dark:text-foreground-dark">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground dark:text-foreground-dark">Mock 表单暗黑模式检查</h1>
            <p className="mt-2 text-sm text-muted-foreground dark:text-muted-dark-foreground">
              业务占位符、边框、背景和按钮状态会随主题一起切换。
            </p>
          </div>
          <ThemeToggle {...args} />
        </div>
        <section className="grid gap-4 rounded-2xl border border-border bg-surface p-6 shadow-button dark:border-border-dark dark:bg-surface-dark md:grid-cols-3">
          <Input aria-label="从业人员姓名" mock="name" clearable />
          <Input aria-label="联系电话" mock="phone" clearable />
          <Input aria-label="企业邮箱" mock="email" clearable />
        </section>
      </div>
    </div>
  ),
};
