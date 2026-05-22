import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge, BadgeDot } from './badge';

describe('Badge', () => {
  it('默认使用 primary 状态样式', () => {
    render(<Badge>进行中</Badge>);

    expect(screen.getByText('进行中')).toHaveClass('bg-primary-soft');
    expect(screen.getByText('进行中')).toHaveClass('text-primary');
  });

  it('支持 success、warning、error 和 gray 状态样式', () => {
    const { rerender } = render(<Badge variant="success">已通过</Badge>);
    expect(screen.getByText('已通过')).toHaveClass('bg-success-soft');

    rerender(<Badge variant="warning">待审核</Badge>);
    expect(screen.getByText('待审核')).toHaveClass('bg-warning-soft');

    rerender(<Badge variant="error">未通过</Badge>);
    expect(screen.getByText('未通过')).toHaveClass('bg-danger-soft');

    rerender(<Badge variant="gray">草稿</Badge>);
    expect(screen.getByText('草稿')).toHaveClass('bg-secondary');
  });

  it('BadgeDot 可以作为头像右上角提醒红点容器', () => {
    render(
      <BadgeDot label="未读消息">
        <span>头像</span>
      </BadgeDot>,
    );

    expect(screen.getByText('头像')).toBeInTheDocument();
    expect(screen.getByLabelText('未读消息')).toHaveClass('bg-danger');
  });
});
