import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

describe('DropdownMenu', () => {
  it('基于 Radix DropdownMenu 支持点击触发菜单项', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>更多操作</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>编辑项目</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole('button', { name: '更多操作' }));
    await user.click(screen.getByRole('menuitem', { name: '编辑项目' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('菜单浮层和条目适配大圆角、动画、科技蓝焦点和暗黑模式', async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>操作</DropdownMenuTrigger>
        <DropdownMenuContent data-testid="dropdown-content">
          <DropdownMenuItem>归档</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole('button', { name: '操作' }));

    const content = screen.getByTestId('dropdown-content');
    const item = screen.getByRole('menuitem', { name: '归档' });

    expect(content).toHaveClass('rounded-2xl');
    expect(content).toHaveClass('data-[state=open]:animate-select-in');
    expect(content.className).toContain('dark:');
    expect(item.className).toContain('focus:bg-primary-soft');
    expect(item.className).toContain('dark:focus:bg-primary-dark-soft');
  });
});
