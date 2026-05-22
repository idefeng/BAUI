import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('默认渲染通用骨架屏样式，并支持暗黑模式', () => {
    render(<Skeleton data-testid="loading-name" />);

    const skeleton = screen.getByTestId('loading-name');

    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveClass('animate-pulse');
    expect(skeleton).toHaveClass('rounded-xl');
    expect(skeleton).toHaveClass('dark:bg-muted-dark');
  });

  it('支持通过 className 自由改变形状和尺寸', () => {
    render(<Skeleton data-testid="avatar" className="size-10 rounded-full" />);

    const skeleton = screen.getByTestId('avatar');

    expect(skeleton).toHaveClass('size-10');
    expect(skeleton).toHaveClass('rounded-full');
  });
});
