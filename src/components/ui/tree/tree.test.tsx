import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tree } from './tree';

const data = [
  {
    title: '技术中心',
    key: 'tech',
    children: [
      { title: '前端组', key: 'frontend' },
      { title: '后端组', key: 'backend' },
    ],
  },
  { title: '运营中心', key: 'ops' },
];

describe('Tree', () => {
  it('渲染树节点并默认展开指定节点', () => {
    render(<Tree data={data} defaultExpandedKeys={['tech']} />);

    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getByText('前端组')).toBeInTheDocument();
  });

  it('点击父节点切换展开状态', async () => {
    const user = userEvent.setup();

    render(<Tree data={data} />);

    expect(screen.queryByText('前端组')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '展开 技术中心' }));

    expect(screen.getByText('前端组')).toBeInTheDocument();
  });

  it('点击节点触发选中回调', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<Tree data={data} defaultExpandedKeys={['tech']} onSelect={onSelect} />);

    await user.click(screen.getByRole('treeitem', { name: '前端组' }));

    expect(onSelect).toHaveBeenCalledWith('frontend');
    expect(screen.getByRole('treeitem', { name: '前端组' })).toHaveAttribute('aria-selected', 'true');
  });
});
