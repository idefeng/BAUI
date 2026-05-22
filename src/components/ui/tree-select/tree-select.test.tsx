import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { TreeSelect, type TreeSelectNode } from './tree-select';

const treeData: TreeSelectNode[] = [
  {
    key: 'hq',
    title: '集团总部',
    children: [
      {
        key: 'rd',
        title: '研发部',
        children: [
          { key: 'frontend', title: '前端组' },
          { key: 'ai', title: 'AI 组' },
        ],
      },
      {
        key: 'ops',
        title: '运营部',
        children: [{ key: 'customer-success', title: '客户成功组' }],
      },
    ],
  },
];

describe('TreeSelect', () => {
  it('勾选父节点时会向下全选所有子孙节点', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<TreeSelect treeData={treeData} value={[]} onChange={onChange} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('checkbox', { name: '研发部' }));

    expect(onChange).toHaveBeenCalledWith(['rd', 'frontend', 'ai']);
  });

  it('子节点部分选中时父节点展示半选态，全部选中时父节点全选', async () => {
    const { rerender } = render(<TreeSelect treeData={treeData} value={['frontend']} onChange={() => undefined} />);

    await userEvent.click(screen.getByRole('combobox'));

    expect(screen.getByRole('checkbox', { name: '研发部' })).toHaveAttribute('data-state', 'indeterminate');

    rerender(<TreeSelect treeData={treeData} value={['rd', 'frontend', 'ai']} onChange={() => undefined} />);

    expect(screen.getByRole('checkbox', { name: '研发部' })).toHaveAttribute('data-state', 'checked');
  });

  it('多选 Tag 支持一键删除并自动清理父级联动状态', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<TreeSelect treeData={treeData} value={['rd', 'frontend', 'ai']} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '移除 前端组' }));

    expect(onChange).toHaveBeenCalledWith(['ai']);
  });

  it('单选模式只回传当前节点并关闭浮层', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<TreeSelect treeData={treeData} value={[]} multiple={false} onChange={onChange} />);

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('checkbox', { name: '前端组' }));

    expect(onChange).toHaveBeenCalledWith(['frontend']);
    expect(screen.queryByTestId('tree-select-content')).not.toBeInTheDocument();
  });

  it('mock 模式自动加载公司全球组织架构树并支持暗黑浮层样式', async () => {
    const user = userEvent.setup();

    render(<TreeSelect mock value={[]} onChange={() => undefined} placeholder="请选择组织范围" />);

    await user.click(screen.getByRole('combobox', { name: '请选择组织范围' }));

    const content = screen.getByTestId('tree-select-content');

    expect(within(content).getByText('灵境实训集团总部')).toBeInTheDocument();
    expect(content.className).toContain('rounded-2xl');
    expect(content.className).toContain('dark:bg-slate-950');
  });
});
