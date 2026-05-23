import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ColorPicker } from './color-picker';

describe('ColorPicker', () => {
  it('selects a preset color and reports the value', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ColorPicker
        aria-label="主题色"
        presets={[{ label: '科技蓝', value: 'hsl(214 100% 43%)' }]}
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: '选择 科技蓝' }));

    expect(handleChange).toHaveBeenCalledWith('hsl(214 100% 43%)');
    expect(screen.getByDisplayValue('hsl(214 100% 43%)')).toBeInTheDocument();
  });

  it('prefers real presets over central mock presets', () => {
    render(
      <ColorPicker
        mock
        aria-label="品牌色"
        presets={[{ label: '自定义色', value: 'hsl(160 66% 44%)' }]}
      />,
    );

    expect(screen.getByRole('button', { name: '选择 自定义色' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '选择 科技蓝' })).not.toBeInTheDocument();
  });

  it('can clear the selected color', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ColorPicker value="hsl(214 100% 43%)" allowClear onChange={handleChange} />);

    await user.click(screen.getByRole('button', { name: '清除颜色' }));

    expect(handleChange).toHaveBeenCalledWith('');
  });
});
