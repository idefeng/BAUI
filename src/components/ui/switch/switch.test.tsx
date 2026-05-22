import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './switch';

describe('Switch', () => {
  it('支持切换状态，并包含呼吸式 focus ring 与暗黑勾选态类名', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(<Switch aria-label="启用通知" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole('switch', { name: '启用通知' });
    await user.click(control);

    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toHaveClass('focus-breathing-ring');
    expect(control).toHaveClass('dark:data-[state=checked]:bg-primary-dark');
  });

  it('disabled 时保留禁用语义并阻止切换', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(<Switch aria-label="系统锁定" disabled onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole('switch', { name: '系统锁定' });
    await user.click(control);

    expect(control).toBeDisabled();
    expect(control).toHaveAttribute('data-disabled');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('支持 Form 友好的 checked 与 onChange 受控属性', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Switch aria-label="是否开通内网权限" checked={false} onChange={onChange} />);

    await user.click(screen.getByRole('switch', { name: '是否开通内网权限' }));

    expect(onChange).toHaveBeenCalledWith(true);
  });
});
