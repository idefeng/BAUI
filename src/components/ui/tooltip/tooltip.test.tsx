import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

describe('Tooltip', () => {
  it('悬停触发器后展示提示内容，并带有现代圆角、边框和阴影', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">查看说明</button>
          </TooltipTrigger>
          <TooltipContent>用于展示辅助说明</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button', { name: '查看说明' }));

    const tooltip = await screen.findByRole('tooltip');
    const content = screen.getAllByText('用于展示辅助说明')[0];

    expect(tooltip).toHaveTextContent('用于展示辅助说明');
    expect(content).toHaveClass('rounded-2xl');
    expect(content).toHaveClass('border-border');
    expect(content).toHaveClass('shadow-tooltip');
  });

  it('提示内容支持暗黑模式样式，并可调整 sideOffset', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">状态</button>
          </TooltipTrigger>
          <TooltipContent sideOffset={12}>暗黑模式提示</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button', { name: '状态' }));

    await screen.findByRole('tooltip');
    const content = screen.getAllByText('暗黑模式提示')[0];

    expect(content).toHaveClass('dark:border-border-dark');
    expect(content).toHaveClass('dark:bg-surface-dark');
  });
});
