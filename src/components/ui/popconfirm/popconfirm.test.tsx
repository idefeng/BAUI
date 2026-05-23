import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Popconfirm } from './popconfirm';

describe('Popconfirm', () => {
  it('点击触发器后展示确认标题和描述', async () => {
    const user = userEvent.setup();

    render(
      <Popconfirm title="删除项目" description="删除后不可恢复。">
        <button type="button">删除</button>
      </Popconfirm>,
    );

    await user.click(screen.getByRole('button', { name: '删除' }));

    expect(screen.getByRole('dialog')).toHaveTextContent('删除项目');
    expect(screen.getByText('删除后不可恢复。')).toHaveClass('text-muted-foreground');
  });

  it('点击确认后触发 onConfirm 并关闭浮层', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(
      <Popconfirm title="归档项目" onConfirm={onConfirm}>
        <button type="button">归档</button>
      </Popconfirm>,
    );

    await user.click(screen.getByRole('button', { name: '归档' }));
    await user.click(screen.getByRole('button', { name: '确认' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('支持危险确认按钮文案', async () => {
    const user = userEvent.setup();

    render(
      <Popconfirm title="删除项目" okText="删除" okVariant="danger">
        <button type="button">删除入口</button>
      </Popconfirm>,
    );

    await user.click(screen.getByRole('button', { name: '删除入口' }));

    expect(screen.getByRole('button', { name: '删除' })).toHaveClass('bg-danger');
  });
});
