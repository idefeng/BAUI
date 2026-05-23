import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Menu } from './menu';

const items = [
  { key: 'dashboard', label: '工作台' },
  {
    key: 'projects',
    label: '项目管理',
    children: [
      { key: 'active-projects', label: '进行中项目' },
      { key: 'archived-projects', label: '归档项目' },
    ],
  },
];

describe('Menu', () => {
  it('renders selected menu items and nested groups', () => {
    render(<Menu items={items} defaultSelectedKey="active-projects" defaultOpenKeys={['projects']} />);

    expect(screen.getByRole('menuitem', { name: '进行中项目' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('menuitem', { name: '工作台' })).toBeInTheDocument();
  });

  it('reports selection when a menu item is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<Menu items={items} onSelect={handleSelect} />);

    await user.click(screen.getByRole('menuitem', { name: '工作台' }));

    expect(handleSelect).toHaveBeenCalledWith('dashboard');
  });
});
