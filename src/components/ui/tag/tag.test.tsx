import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tag } from './tag';

describe('Tag', () => {
  it('默认使用 primary 低饱和标签样式', () => {
    render(<Tag>React 培训</Tag>);

    expect(screen.getByText('React 培训')).toHaveClass('rounded-md');
    expect(screen.getByText('React 培训')).toHaveClass('bg-primary-soft/70');
    expect(screen.getByText('React 培训')).toHaveClass('text-primary');
  });

  it('支持 success、warning、error 和 gray 变体', () => {
    const { rerender } = render(<Tag variant="success">已通过</Tag>);
    expect(screen.getByText('已通过')).toHaveClass('bg-success-soft/70');

    rerender(<Tag variant="warning">待审核</Tag>);
    expect(screen.getByText('待审核')).toHaveClass('bg-warning-soft/70');

    rerender(<Tag variant="error">异常</Tag>);
    expect(screen.getByText('异常')).toHaveClass('bg-danger-soft/70');

    rerender(<Tag variant="gray">草稿</Tag>);
    expect(screen.getByText('草稿')).toHaveClass('bg-secondary/80');
  });

  it('closable 开启后点击关闭按钮触发回调并进入淡出状态', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Tag closable onClose={onClose}>
        可关闭标签
      </Tag>,
    );

    await user.click(screen.getByRole('button', { name: '关闭 可关闭标签' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText('可关闭标签')).toHaveClass('scale-95');
    expect(screen.getByText('可关闭标签')).toHaveClass('opacity-0');
  });

  it('mock 开启且未传内容时自动使用中心 mock 标签', () => {
    render(<Tag mock />);

    expect(screen.getByText('React 组件库')).toHaveClass('bg-primary-soft/70');
  });
});
