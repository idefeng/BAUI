import type { Meta, StoryObj } from '@storybook/react';

import { BrandBackground, BrandLogo, BrandWatermark } from './branding';

const meta = {
  title: 'UI/Branding',
  component: BrandLogo,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof BrandLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LogoSystem: Story = {
  render: () => (
    <div className="grid gap-8 rounded-3xl border border-border bg-surface p-8 dark:border-border-dark dark:bg-surface-dark">
      <BrandLogo variant="full" size="lg" />
      <BrandLogo variant="icon" size="lg" />
    </div>
  ),
};

export const BackgroundLayer: Story = {
  render: () => (
    <div className="relative min-h-80 overflow-hidden rounded-3xl border border-border bg-background p-8 dark:border-border-dark dark:bg-background-dark">
      <BrandBackground />
      <div className="relative z-10 max-w-xl space-y-3">
        <BrandLogo variant="full" size="lg" />
        <p className="text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
          中央品牌背景可作为页面底纹，提供轻量网格、科技蓝微光和暗色模式适配。
        </p>
      </div>
    </div>
  ),
};

export const SecurityWatermark: Story = {
  render: () => (
    <div className="relative min-h-96 overflow-hidden rounded-3xl border border-border bg-surface p-8 dark:border-border-dark dark:bg-surface-dark">
      <BrandWatermark text="NEXUS 内部资产" />
      <div className="relative z-20 space-y-3">
        <BrandLogo variant="full" />
        <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
          防伪水印默认不拦截交互，适合 Dashboard、报告预览和内部资料页叠加使用。
        </p>
      </div>
    </div>
  ),
};
