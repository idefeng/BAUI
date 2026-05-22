import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ToastProvider, ToastRoot, ToastTitle, ToastViewport } from './toast';

const getToastByTitle = (title: string) => screen.getByText(title).closest('[role="status"]');

describe('Toast', () => {
  it('支持 success、error、info 三种状态样式', () => {
    const { rerender } = render(
      <ToastProvider>
        <ToastRoot open variant="success">
          <ToastTitle>保存成功</ToastTitle>
        </ToastRoot>
        <ToastViewport />
      </ToastProvider>,
    );

    expect(getToastByTitle('保存成功')).toHaveClass('border-success');

    rerender(
      <ToastProvider>
        <ToastRoot open variant="error">
          <ToastTitle>保存失败</ToastTitle>
        </ToastRoot>
        <ToastViewport />
      </ToastProvider>,
    );

    expect(getToastByTitle('保存失败')).toHaveClass('border-danger');

    rerender(
      <ToastProvider>
        <ToastRoot open variant="info">
          <ToastTitle>系统提示</ToastTitle>
        </ToastRoot>
        <ToastViewport />
      </ToastProvider>,
    );

    expect(getToastByTitle('系统提示')).toHaveClass('border-primary');
  });

  it('默认 5 秒自动关闭并固定在右上角滑出', () => {
    render(
      <ToastProvider>
        <ToastRoot open>
          <ToastTitle>自动关闭</ToastTitle>
        </ToastRoot>
        <ToastViewport data-testid="toast-viewport" />
      </ToastProvider>,
    );

    expect(getToastByTitle('自动关闭')).toHaveAttribute('data-duration', '5000');
    expect(getToastByTitle('自动关闭')).toHaveClass('data-[state=closed]:animate-toast-out');
    expect(screen.getByTestId('toast-viewport')).toHaveClass('fixed');
    expect(screen.getByTestId('toast-viewport')).toHaveClass('right-6');
    expect(screen.getByTestId('toast-viewport')).toHaveClass('top-6');
  });
});
