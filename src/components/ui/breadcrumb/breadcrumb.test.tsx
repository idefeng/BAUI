import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  it('按 items 渲染面包屑导航并标记当前页', () => {
    render(
      <Breadcrumb
        items={[
          { title: '首页', href: '/' },
          { title: '培训项目', href: '/projects' },
          { title: '项目详情' },
        ]}
      />,
    );

    expect(screen.getByRole('navigation', { name: '面包屑' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '首页' })).toHaveAttribute('href', '/');
    expect(screen.getByText('项目详情')).toHaveAttribute('aria-current', 'page');
  });

  it('支持自定义分隔符', () => {
    render(<Breadcrumb separator="/" items={[{ title: '控制台' }, { title: '证书' }]} />);

    expect(screen.getAllByText('/')).toHaveLength(1);
  });
});
