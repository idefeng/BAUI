import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Anchor } from './anchor';

const items = [
  { title: '项目概览', href: '#overview' },
  { title: '学员名单', href: '#learners' },
  { title: '证书记录', href: '#certificates' },
];

describe('Anchor', () => {
  it('渲染锚点导航链接', () => {
    render(<Anchor items={items} activeHref="#learners" />);

    expect(screen.getByRole('navigation', { name: '锚点导航' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '学员名单' })).toHaveClass('text-primary');
  });

  it('点击锚点时触发 onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Anchor items={items} onChange={onChange} />);

    await user.click(screen.getByRole('link', { name: '证书记录' }));

    expect(onChange).toHaveBeenCalledWith('#certificates');
  });
});
