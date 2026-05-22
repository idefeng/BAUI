import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from './popover';

describe('Popover', () => {
  it('点击触发器后展示现代大圆角浮层和箭头', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger asChild>
          <button type="button">学员档案</button>
        </PopoverTrigger>
        <PopoverContent>
          <p>林予安 · 96% 学习进度</p>
          <PopoverArrow data-testid="popover-arrow" />
        </PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole('button', { name: '学员档案' }));

    expect(screen.getByText('林予安 · 96% 学习进度')).toBeInTheDocument();
    expect(screen.getByTestId('boao-popover-content')).toHaveClass('rounded-2xl');
    expect(screen.getByTestId('boao-popover-content')).toHaveClass('text-foreground');
    expect(screen.getByTestId('popover-arrow')).toHaveClass('fill-surface');
  });
});
