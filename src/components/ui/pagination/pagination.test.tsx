import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Pagination, getPaginationItems } from './pagination';

describe('Pagination', () => {
  it('计算大页数时保留首尾页，并用省略号折叠中间页码', () => {
    expect(getPaginationItems(20, 10)).toEqual([1, 'ellipsis-left', 8, 9, 10, 11, 12, 'ellipsis-right', 20]);
    expect(getPaginationItems(20, 1)).toEqual([1, 2, 3, 4, 5, 'ellipsis-right', 20]);
    expect(getPaginationItems(20, 20)).toEqual([1, 'ellipsis-left', 16, 17, 18, 19, 20]);
  });

  it('渲染页码、总条数，并在首尾页禁用上一页或下一页', () => {
    const { rerender } = render(<Pagination total={95} pageSize={10} currentPage={1} onPageChange={vi.fn()} />);

    expect(screen.getByText('共 95 条')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '第 1 页' })).toHaveClass('bg-primary');
    expect(screen.getByText('...')).toBeInTheDocument();

    rerender(<Pagination total={95} pageSize={10} currentPage={10} onPageChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
  });

  it('点击页码和上一页/下一页时回调目标页码与当前 pageSize', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();

    render(<Pagination total={95} pageSize={10} currentPage={5} onPageChange={onPageChange} />);

    await user.click(screen.getByRole('button', { name: '第 6 页' }));
    await user.click(screen.getByRole('button', { name: '上一页' }));
    await user.click(screen.getByRole('button', { name: '下一页' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 6, 10);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 4, 10);
    expect(onPageChange).toHaveBeenNthCalledWith(3, 6, 10);
  });

  it('显示每页条数切换器，并在切换时回到第一页', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();

    render(<Pagination total={300} pageSize={10} currentPage={5} showSizeChanger onPageChange={onPageChange} />);

    await user.click(screen.getByRole('combobox', { name: '每页条数' }));
    await user.click(screen.getByRole('option', { name: '20 条/页' }));

    expect(onPageChange).toHaveBeenCalledWith(1, 20);
  });
});
