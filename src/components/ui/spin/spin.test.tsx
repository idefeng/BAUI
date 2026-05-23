import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Spin } from './spin';

describe('Spin', () => {
  it('默认渲染加载图标和可访问文案', () => {
    render(<Spin tip="数据加载中" />);

    expect(screen.getByRole('status', { name: '数据加载中' })).toHaveClass('text-primary');
    expect(screen.getByText('数据加载中')).toHaveClass('text-muted-foreground');
  });

  it('支持包裹内容并用 spinning 控制遮罩', () => {
    render(
      <Spin spinning tip="保存中">
        <div>表单内容</div>
      </Spin>,
    );

    expect(screen.getByText('表单内容')).toHaveClass('opacity-50');
    expect(screen.getByRole('status', { name: '保存中' })).toBeInTheDocument();
  });
});
