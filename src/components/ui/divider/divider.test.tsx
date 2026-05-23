import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Divider } from './divider';

describe('Divider', () => {
  it('默认渲染水平分割线', () => {
    render(<Divider data-testid="divider" />);

    expect(screen.getByTestId('divider')).toHaveAttribute('role', 'separator');
    expect(screen.getByTestId('divider')).toHaveClass('h-px');
    expect(screen.getByTestId('divider')).toHaveClass('bg-border');
  });

  it('支持带文案的分割线', () => {
    render(<Divider>项目资料</Divider>);

    expect(screen.getByText('项目资料')).toHaveClass('text-muted-foreground');
  });

  it('支持垂直方向', () => {
    render(<Divider orientation="vertical" data-testid="divider" />);

    expect(screen.getByTestId('divider')).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getByTestId('divider')).toHaveClass('h-6');
    expect(screen.getByTestId('divider')).toHaveClass('w-px');
  });
});
