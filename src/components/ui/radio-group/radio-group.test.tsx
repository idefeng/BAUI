import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RadioGroup, RadioGroupItem } from './radio-group';

describe('RadioGroup', () => {
  it('支持单选切换，并包含呼吸式 focus ring 与暗黑选中态类名', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <RadioGroup defaultValue="weekly" onValueChange={onValueChange}>
        <RadioGroupItem aria-label="每日" value="daily" />
        <RadioGroupItem aria-label="每周" value="weekly" />
      </RadioGroup>,
    );

    const daily = screen.getByRole('radio', { name: '每日' });
    await user.click(daily);

    expect(daily).toHaveAttribute('aria-checked', 'true');
    expect(onValueChange).toHaveBeenCalledWith('daily');
    expect(daily).toHaveClass('focus-breathing-ring');
    expect(daily).toHaveClass('dark:data-[state=checked]:border-primary-dark');
  });

  it('disabled 项保留禁用语义并阻止切换', async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <RadioGroup defaultValue="available" onValueChange={onValueChange}>
        <RadioGroupItem aria-label="可用" value="available" />
        <RadioGroupItem aria-label="停用" disabled value="disabled" />
      </RadioGroup>,
    );

    const disabledItem = screen.getByRole('radio', { name: '停用' });
    await user.click(disabledItem);

    expect(disabledItem).toBeDisabled();
    expect(disabledItem).toHaveAttribute('data-disabled');
    expect(disabledItem).toHaveAttribute('aria-checked', 'false');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
