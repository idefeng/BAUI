import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BrandBackground, BrandLogo, BrandWatermark } from './branding';

describe('Branding', () => {
  it('BrandLogo full 变体渲染标准中英文字标并适配暗黑模式', () => {
    render(<BrandLogo variant="full" data-testid="brand-logo" />);

    const logo = screen.getByTestId('brand-logo');

    expect(logo.tagName.toLowerCase()).toBe('svg');
    expect(logo).toHaveAttribute('aria-label', '博奥教育 / ETLCHINA 品牌标识');
    expect(logo).toHaveClass('text-slate-900');
    expect(logo).toHaveClass('dark:text-white');
    expect(screen.getByText('ET')).toBeInTheDocument();
    expect(screen.getByText('博奥教育')).toBeInTheDocument();
    expect(screen.getByText('ETLCHINA')).toBeInTheDocument();
  });

  it('BrandLogo icon 变体只渲染徽标图形并保留科技蓝暗色状态', () => {
    render(<BrandLogo variant="icon" data-testid="brand-logo-icon" />);

    const logo = screen.getByTestId('brand-logo-icon');

    expect(logo).toHaveAttribute('viewBox', '0 0 64 64');
    expect(logo).toHaveClass('text-primary');
    expect(logo).toHaveClass('dark:text-primary-dark');
    expect(logo.querySelector('[data-slot="brand-mark-shell"]')).toBeInTheDocument();
    expect(logo.querySelector('[data-slot="brand-mark-accent"]')).toHaveClass('text-success');
    expect(screen.getByText('ET')).toBeInTheDocument();
    expect(screen.queryByText('博奥教育')).not.toBeInTheDocument();
  });

  it('BrandBackground 使用网格与科技蓝微光作为可复用背景层', () => {
    render(<BrandBackground data-testid="brand-background" />);

    const background = screen.getByTestId('brand-background');

    expect(background).toHaveAttribute('aria-hidden', 'true');
    expect(background.className).toContain('[background-image:radial-gradient');
    expect(background.className).toContain('blur-3xl');
    expect(background.className).toContain('dark:');
  });

  it('BrandWatermark 渲染可复用防伪水印文案', () => {
    render(<BrandWatermark text="ETLCHINA 内部资产" data-testid="brand-watermark" />);

    expect(screen.getByTestId('brand-watermark')).toHaveClass('pointer-events-none');
    expect(screen.getAllByText('ETLCHINA 内部资产').length).toBeGreaterThan(1);
  });
});
