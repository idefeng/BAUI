import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { FloatButton } from './float-button';

describe('FloatButton', () => {
  it('默认固定在右下角并响应点击', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<FloatButton aria-label="快速新建" onClick={onClick} />);

    expect(screen.getByRole('button', { name: '快速新建' })).toHaveClass('fixed');
    expect(screen.getByRole('button', { name: '快速新建' })).toHaveClass('bottom-8');

    await user.click(screen.getByRole('button', { name: '快速新建' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('支持 tooltip 文案和危险状态', () => {
    render(<FloatButton variant="danger" tooltip="上报异常" aria-label="上报异常" />);

    expect(screen.getByRole('button', { name: '上报异常' })).toHaveClass('bg-danger');
    expect(screen.getByText('上报异常')).toHaveClass('text-foreground');
  });
});
