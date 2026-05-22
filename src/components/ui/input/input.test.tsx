import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search, X } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input';

describe('Input', () => {
  it('支持前缀和后缀图标，并使用主色 focus ring 类名', () => {
    render(
      <Input
        aria-label="搜索"
        placeholder="搜索项目"
        prefixIcon={<Search />}
        suffixIcon={<X />}
        rootClassName="custom-root"
      />,
    );

    const root = screen.getByTestId('boao-input-root');

    expect(screen.getByRole('textbox', { name: '搜索' })).toBeInTheDocument();
    expect(root).toHaveClass('focus-within:ring-2');
    expect(root).toHaveClass('focus-within:ring-primary/20');
    expect(root).toHaveClass('custom-root');
  });

  it('clearable 可以一键清除输入内容并触发 onClear', async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();

    render(<Input aria-label="姓名" clearable defaultValue="博鳌" onClear={onClear} />);

    const input = screen.getByRole('textbox', { name: '姓名' });
    expect(input).toHaveValue('博鳌');

    await user.click(screen.getByRole('button', { name: '清除输入内容' }));

    expect(input).toHaveValue('');
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('禁用时不展示清除按钮并保留 disabled 语义', () => {
    render(<Input aria-label="编码" clearable disabled defaultValue="BA-001" />);

    expect(screen.getByRole('textbox', { name: '编码' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: '清除输入内容' })).not.toBeInTheDocument();
  });

  it('mock 属性会切换为逼真的业务占位符', () => {
    render(<Input aria-label="手机号" mock="phone" />);

    expect(screen.getByRole('textbox', { name: '手机号' })).toHaveAttribute('placeholder', '请输入脱敏手机号，如 138****2026');
  });
});
