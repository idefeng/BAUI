import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Calendar } from './calendar';

describe('Calendar', () => {
  it('renders a month panel and reports date selection', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Calendar value={new Date(2026, 4, 22)} onChange={handleChange} />);

    expect(screen.getByText('2026年 5月')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '选择 2026-05-15' }));

    expect(handleChange).toHaveBeenCalledWith(new Date(2026, 4, 15));
  });

  it('can navigate to the next month', async () => {
    const user = userEvent.setup();

    render(<Calendar defaultValue={new Date(2026, 4, 22)} />);

    await user.click(screen.getByRole('button', { name: '下个月' }));

    expect(screen.getByText('2026年 6月')).toBeInTheDocument();
  });

  it('renders mock calendar events from central mock data', () => {
    render(<Calendar mock value={new Date(2026, 4, 22)} />);

    expect(screen.getByText('线上直播')).toBeInTheDocument();
  });
});
