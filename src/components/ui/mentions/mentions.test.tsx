import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Mentions } from './mentions';

describe('Mentions', () => {
  it('filters mention options and inserts the selected person', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <Mentions
        aria-label="审核意见"
        options={[
          { label: '林予安', value: 'lin-yuan' },
          { label: '周明轩', value: 'zhou-mingxuan' },
        ]}
        onSelect={handleSelect}
      />,
    );

    const input = screen.getByRole('textbox', { name: '审核意见' });
    await user.type(input, '请 @林');

    expect(screen.getByRole('option', { name: '林予安' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: '周明轩' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: '林予安' }));

    expect(input).toHaveValue('请 @林予安 ');
    expect(handleSelect).toHaveBeenCalledWith({ label: '林予安', value: 'lin-yuan' });
  });

  it('loads central mock people when mock is enabled', async () => {
    const user = userEvent.setup();

    render(<Mentions mock aria-label="Mock 审核意见" />);

    await user.type(screen.getByRole('textbox', { name: 'Mock 审核意见' }), '@林');

    expect(screen.getByRole('option', { name: '林予安' })).toBeInTheDocument();
  });
});
