import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark');
    window.localStorage.clear();
  });

  it('点击后向 documentElement 添加或移除 dark 类名', async () => {
    const user = userEvent.setup();

    render(<ThemeToggle />);

    await user.click(screen.getByRole('button', { name: '切换到暗色模式' }));

    expect(document.documentElement).toHaveClass('dark');
    expect(window.localStorage.getItem('etlchina-ui-theme')).toBe('dark');

    await user.click(screen.getByRole('button', { name: '切换到亮色模式' }));

    expect(document.documentElement).not.toHaveClass('dark');
    expect(window.localStorage.getItem('etlchina-ui-theme')).toBe('light');
  });
});
