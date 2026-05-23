import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AutoComplete } from './auto-complete';

describe('AutoComplete', () => {
  it('filters options and writes the selected label into the input', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <AutoComplete
        aria-label="项目搜索"
        options={[
          { label: '食品安全管理员项目', value: 'food-safety' },
          { label: '继续医学教育项目', value: 'cme' },
        ]}
        onSelect={handleSelect}
      />,
    );

    const input = screen.getByRole('combobox', { name: '项目搜索' });
    await user.type(input, '食品');

    expect(screen.getByRole('option', { name: '食品安全管理员项目' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: '继续医学教育项目' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: '食品安全管理员项目' }));

    expect(input).toHaveValue('食品安全管理员项目');
    expect(handleSelect).toHaveBeenCalledWith({ label: '食品安全管理员项目', value: 'food-safety' });
  });

  it('uses central mock options when mock is enabled', async () => {
    const user = userEvent.setup();

    render(<AutoComplete mock aria-label="Mock 项目搜索" />);

    await user.click(screen.getByRole('combobox', { name: 'Mock 项目搜索' }));

    expect(screen.getByRole('option', { name: '食品安全管理员项目' })).toBeInTheDocument();
  });

  it('shows an empty state when no option matches the input', async () => {
    const user = userEvent.setup();

    render(
      <AutoComplete
        aria-label="城市搜索"
        emptyText="没有匹配项目"
        options={[{ label: '北京市', value: 'beijing' }]}
      />,
    );

    await user.type(screen.getByRole('combobox', { name: '城市搜索' }), '上海');

    expect(screen.getByText('没有匹配项目')).toBeInTheDocument();
  });
});
