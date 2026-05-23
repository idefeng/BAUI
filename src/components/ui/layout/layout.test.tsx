import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSider } from './layout';

describe('Layout', () => {
  it('渲染后台页面布局区域', () => {
    render(
      <Layout>
        <LayoutHeader>顶部导航</LayoutHeader>
        <Layout>
          <LayoutSider>侧边栏</LayoutSider>
          <LayoutContent>页面内容</LayoutContent>
        </Layout>
        <LayoutFooter>页脚</LayoutFooter>
      </Layout>,
    );

    expect(screen.getByText('顶部导航')).toHaveClass('border-b');
    expect(screen.getByText('侧边栏')).toHaveClass('w-64');
    expect(screen.getByText('页面内容')).toHaveClass('flex-1');
    expect(screen.getByText('页脚')).toHaveClass('border-t');
  });

  it('Sider 支持 collapsed 宽度', () => {
    render(<LayoutSider collapsed data-testid="sider">导航</LayoutSider>);

    expect(screen.getByTestId('sider')).toHaveClass('w-20');
  });
});
