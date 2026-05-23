import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Splitter } from './splitter';

describe('Splitter', () => {
  it('renders panes and exposes an accessible separator', () => {
    render(
      <Splitter defaultSizes={[35, 65]}>
        <section>项目列表</section>
        <section>项目详情</section>
      </Splitter>,
    );

    expect(screen.getByText('项目列表')).toBeInTheDocument();
    expect(screen.getByText('项目详情')).toBeInTheDocument();
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuenow', '35');
  });

  it('resizes panes with keyboard controls', async () => {
    const user = userEvent.setup();
    const handleResize = vi.fn();

    render(
      <Splitter defaultSizes={[40, 60]} onResize={handleResize}>
        <section>左侧目录</section>
        <section>右侧内容</section>
      </Splitter>,
    );

    await user.tab();
    await user.keyboard('{ArrowRight}');

    expect(handleResize).toHaveBeenLastCalledWith([45, 55]);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-valuenow', '45');
  });
});
