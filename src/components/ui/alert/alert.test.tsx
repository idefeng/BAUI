import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Alert } from './alert';

describe('Alert', () => {
  it('渲染带标题和描述的提示信息', () => {
    render(<Alert title="资料待审核" description="请在开班前完成学员资质审核。" />);

    expect(screen.getByRole('status')).toHaveTextContent('资料待审核');
    expect(screen.getByText('请在开班前完成学员资质审核。')).toHaveClass('text-muted-foreground');
  });

  it('success、warning 和 error 状态使用对应语义色', () => {
    const { rerender } = render(<Alert variant="success" title="已通过" />);
    expect(screen.getByRole('status')).toHaveClass('border-success');

    rerender(<Alert variant="warning" title="待处理" />);
    expect(screen.getByRole('status')).toHaveClass('border-warning');

    rerender(<Alert variant="error" title="审核失败" />);
    expect(screen.getByRole('alert')).toHaveClass('border-danger');
  });

  it('closable 开启后展示关闭按钮', () => {
    render(<Alert closable title="系统通知" />);

    expect(screen.getByRole('button', { name: '关闭提示' })).toBeInTheDocument();
  });
});
