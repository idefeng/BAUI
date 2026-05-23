import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Space } from './space';

describe('Space', () => {
  it('默认横向排列并应用中等间距', () => {
    render(
      <Space data-testid="space">
        <span>筛选</span>
        <span>导出</span>
      </Space>,
    );

    expect(screen.getByTestId('space')).toHaveClass('inline-flex');
    expect(screen.getByTestId('space')).toHaveClass('gap-3');
  });

  it('支持纵向排列、换行和紧凑间距', () => {
    render(
      <Space direction="vertical" size="sm" wrap data-testid="space">
        <span>姓名</span>
        <span>手机号</span>
      </Space>,
    );

    expect(screen.getByTestId('space')).toHaveClass('flex-col');
    expect(screen.getByTestId('space')).toHaveClass('gap-2');
    expect(screen.getByTestId('space')).toHaveClass('flex-wrap');
  });
});
