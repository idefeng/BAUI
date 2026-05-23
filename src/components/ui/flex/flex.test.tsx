import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Flex } from './flex';

describe('Flex', () => {
  it('默认渲染横向 flex 容器并应用 gap', () => {
    render(
      <Flex gap="md" data-testid="flex">
        <span>筛选</span>
        <span>导出</span>
      </Flex>,
    );

    expect(screen.getByTestId('flex')).toHaveClass('flex');
    expect(screen.getByTestId('flex')).toHaveClass('flex-row');
    expect(screen.getByTestId('flex')).toHaveClass('gap-3');
  });

  it('支持垂直方向、两端分布和换行', () => {
    render(<Flex vertical justify="between" align="start" wrap data-testid="flex" />);

    expect(screen.getByTestId('flex')).toHaveClass('flex-col');
    expect(screen.getByTestId('flex')).toHaveClass('justify-between');
    expect(screen.getByTestId('flex')).toHaveClass('items-start');
    expect(screen.getByTestId('flex')).toHaveClass('flex-wrap');
  });
});
