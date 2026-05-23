import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Rate } from './rate';

describe('Rate', () => {
  it('selects a score and exposes it through onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Rate aria-label="课程满意度" onChange={handleChange} />);

    await user.click(screen.getByRole('radio', { name: '4 星' }));

    expect(handleChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole('radio', { name: '4 星' })).toHaveAttribute('aria-checked', 'true');
  });

  it('can clear the current score when clicking the selected item again', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Rate aria-label="服务评价" defaultValue={3} onChange={handleChange} />);

    await user.click(screen.getByRole('radio', { name: '3 星' }));

    expect(handleChange).toHaveBeenCalledWith(0);
    expect(screen.getByRole('radio', { name: '3 星' })).toHaveAttribute('aria-checked', 'false');
  });

  it('prefers real value over mock fallback', () => {
    render(<Rate mock value={2} aria-label="Mock 评分" />);

    expect(screen.getByRole('radio', { name: '2 星' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '4 星' })).toHaveAttribute('aria-checked', 'false');
  });
});
