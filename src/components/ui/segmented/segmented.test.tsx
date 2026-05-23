import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Segmented } from './segmented';

const options = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'active' },
  { label: '已结项', value: 'done' },
];

describe('Segmented', () => {
  it('渲染选项并标记当前选中项', () => {
    render(<Segmented value="active" options={options} />);

    expect(screen.getByRole('button', { name: '进行中' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '进行中' })).toHaveClass('bg-surface');
  });

  it('点击选项时触发 onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<Segmented defaultValue="all" options={options} onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: '已结项' }));

    expect(onValueChange).toHaveBeenCalledWith('done');
  });

  it('禁用选项不可点击', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<Segmented options={[...options, { label: '禁用', value: 'disabled', disabled: true }]} onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: '禁用' }));

    expect(onValueChange).not.toHaveBeenCalledWith('disabled');
  });
});
