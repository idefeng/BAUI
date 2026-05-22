import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('支持勾选状态，并包含呼吸式 focus ring 与暗黑勾选态类名', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox aria-label="同意协议" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole('checkbox', { name: '同意协议' });
    await user.click(control);

    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toHaveClass('focus-breathing-ring');
    expect(control).toHaveClass('dark:data-[state=checked]:bg-primary-dark');
  });

  it('disabled 时保留禁用语义并阻止勾选', async () => {
    const onCheckedChange = vi.fn();
    const user = userEvent.setup();

    render(<Checkbox aria-label="禁止修改" disabled onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole('checkbox', { name: '禁止修改' });
    await user.click(control);

    expect(control).toBeDisabled();
    expect(control).toHaveAttribute('data-disabled');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
