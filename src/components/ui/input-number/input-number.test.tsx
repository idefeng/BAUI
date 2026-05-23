import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { InputNumber } from './input-number';

describe('InputNumber', () => {
  it('渲染数字输入框并按 step 增减', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<InputNumber defaultValue={10} step={5} onChange={onChange} aria-label="培训人数" />);

    await user.click(screen.getByRole('button', { name: '增加数值' }));
    expect(screen.getByRole('spinbutton', { name: '培训人数' })).toHaveValue(15);
    expect(onChange).toHaveBeenLastCalledWith(15);

    await user.click(screen.getByRole('button', { name: '减少数值' }));
    expect(screen.getByRole('spinbutton', { name: '培训人数' })).toHaveValue(10);
  });

  it('遵守 min 和 max 边界', async () => {
    const user = userEvent.setup();

    render(<InputNumber defaultValue={1} min={1} max={2} aria-label="课时" />);

    await user.click(screen.getByRole('button', { name: '减少数值' }));
    expect(screen.getByRole('spinbutton', { name: '课时' })).toHaveValue(1);

    await user.click(screen.getByRole('button', { name: '增加数值' }));
    await user.click(screen.getByRole('button', { name: '增加数值' }));
    expect(screen.getByRole('spinbutton', { name: '课时' })).toHaveValue(2);
  });

  it('mock 开启且无默认值时填充培训人数', () => {
    render(<InputNumber mock aria-label="报名人数" />);

    expect(screen.getByRole('spinbutton', { name: '报名人数' })).toHaveValue(128);
  });
});
