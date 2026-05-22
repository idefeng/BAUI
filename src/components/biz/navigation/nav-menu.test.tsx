import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NavMenu, type NavMenuItem } from './nav-menu';

const items: NavMenuItem[] = [
  { key: 'home', label: '首页', icon: 'Home', path: '/' },
  {
    key: 'courses',
    label: '课程中心',
    icon: 'BookOpen',
    path: '/courses',
    children: [
      { key: 'course-list', label: '课程列表', icon: 'ListChecks', path: '/courses/list' },
      { key: 'certificate', label: '证书模版', icon: 'Award', path: '/courses/certificates' },
    ],
  },
];

describe('NavMenu', () => {
  it('mock 模式自动注入培训管理系统菜单树并支持纵向展开', () => {
    render(<NavMenu mock layout="vertical" currentPath="/certificates" />);

    expect(screen.getByTestId('nav-menu-root').className).toContain('dark:');
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('学员管理')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '课程中心' }));

    expect(screen.getByRole('link', { name: '课程列表' })).toHaveAttribute('href', '/courses');
    expect(screen.getByRole('link', { name: '证书模版' })).toHaveAttribute('href', '/certificates');
    expect(screen.getByTestId('nav-menu-item-certificate')).toHaveClass('bg-primary/10');
    expect(screen.getByTestId('nav-menu-item-certificate')).toHaveClass('dark:bg-primary/20');
    expect(screen.getByTestId('nav-menu-indicator-certificate')).toHaveClass('w-[3px]');
  });

  it('横向布局悬浮父级菜单时展示现代浮层子菜单', () => {
    render(<NavMenu items={items} layout="horizontal" currentPath="/courses/list" />);

    fireEvent.mouseEnter(screen.getByRole('button', { name: '课程中心' }));

    const popover = screen.getByTestId('nav-menu-popover-courses');

    expect(popover).toHaveClass('rounded-2xl');
    expect(popover).toHaveClass('shadow-tooltip');
    expect(within(popover).getByRole('link', { name: '课程列表' })).toHaveAttribute('href', '/courses/list');
    expect(screen.getByTestId('nav-menu-item-course-list')).toHaveClass('bg-primary/10');
  });

  it('普通叶子菜单渲染为链接并保留科技蓝激活态', () => {
    render(<NavMenu items={items} layout="horizontal" currentPath="/" />);

    const home = screen.getByRole('link', { name: '首页' });

    expect(home).toHaveAttribute('href', '/');
    expect(home).toHaveClass('bg-primary/10');
    expect(home).toHaveClass('dark:bg-primary/20');
  });
});
