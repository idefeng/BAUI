import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SmartTable, type SmartTableColumn } from './smart-table';

interface DemoRow {
  id: string;
  name: string;
  status: 'active' | 'paused';
  owner: string;
}

const rows: DemoRow[] = [
  { id: '1', name: '数据中台接入', status: 'active', owner: '林医生' },
  { id: '2', name: '机构账号审核', status: 'paused', owner: '王老师' },
];

const columns: SmartTableColumn<DemoRow>[] = [
  { key: 'name', title: '项目名称', dataIndex: 'name', ellipsis: true },
  { key: 'status', title: '状态', dataIndex: 'status', render: (value) => (value === 'active' ? '启用' : '暂停') },
  { key: 'owner', title: '负责人', dataIndex: 'owner' },
];

describe('SmartTable', () => {
  it('组合搜索、筛选和右侧操作按钮', async () => {
    const onSearchChange = vi.fn();
    const onFilterChange = vi.fn();
    const onAction = vi.fn();
    const user = userEvent.setup();

    render(
      <SmartTable
        columns={columns}
        data={rows}
        rowKey="id"
        searchValue=""
        onSearchChange={onSearchChange}
        filterValue="all"
        onFilterChange={onFilterChange}
        filterOptions={[
          { label: '全部状态', value: 'all' },
          { label: '启用', value: 'active' },
        ]}
        actionLabel="新增项目"
        onAction={onAction}
      />,
    );

    await user.type(screen.getByRole('textbox', { name: '搜索表格数据' }), '账号');
    await user.click(screen.getByRole('button', { name: '新增项目' }));

    expect(screen.getByRole('combobox', { name: '筛选表格数据' })).toBeInTheDocument();
    expect(onSearchChange).toHaveBeenCalled();
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('支持当前页全选和单行选择', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SmartTable
        columns={columns}
        data={rows}
        rowKey="id"
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: '选择全部当前页数据' }));
    expect(onSelectionChange).toHaveBeenLastCalledWith(['1', '2'], rows);

    const secondRow = screen.getByRole('row', { name: /机构账号审核/ });
    await user.click(within(secondRow).getByRole('checkbox', { name: '选择 机构账号审核' }));

    expect(onSelectionChange).toHaveBeenLastCalledWith(['1'], [rows[0]]);
  });

  it('支持单选模式', async () => {
    const onSelectionChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SmartTable
        columns={columns}
        data={rows}
        rowKey="id"
        selectable
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      />,
    );

    await user.click(screen.getByRole('radio', { name: '选择 数据中台接入' }));
    await user.click(screen.getByRole('radio', { name: '选择 机构账号审核' }));

    expect(onSelectionChange).toHaveBeenLastCalledWith(['2'], [rows[1]]);
  });

  it('展示 Loading 遮罩和空状态占位', () => {
    const { rerender } = render(<SmartTable columns={columns} data={rows} rowKey="id" loading />);

    expect(screen.getByTestId('smart-table-loading')).toHaveClass('backdrop-blur-sm');

    rerender(<SmartTable columns={columns} data={[]} rowKey="id" emptyText="暂无项目数据" />);

    expect(screen.getByTestId('smart-table-brand-placeholder')).toBeInTheDocument();
    expect(screen.getByText('公司专属资产')).toBeInTheDocument();
    expect(screen.getByText('暂无项目数据')).toBeInTheDocument();
  });

  it('分页器触发分页联动并保持品牌样式', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SmartTable
        columns={columns}
        data={rows}
        rowKey="id"
        pagination={{ page: 1, pageSize: 10, total: 21 }}
        onPageChange={onPageChange}
      />,
    );

    const currentPage = screen.getByRole('button', { name: '第 1 页' });
    await user.click(screen.getByRole('button', { name: '下一页' }));

    expect(currentPage).toHaveClass('bg-primary');
    expect(currentPage).toHaveClass('rounded-xl');
    expect(onPageChange).toHaveBeenCalledWith(2, 10);
  });

  it('mock 模式在 800ms 骨架屏后渲染项目业务表头和数据', async () => {
    vi.useFakeTimers();

    try {
      render(<SmartTable mock mockType="project" />);

      expect(screen.getByTestId('smart-table-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('smart-table-brand-placeholder')).toHaveTextContent('公司专属资产');

      await act(async () => {
        vi.advanceTimersByTime(800);
      });

      expect(screen.queryByTestId('smart-table-skeleton')).not.toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: '项目名称' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: '培训类型' })).toBeInTheDocument();
      expect(screen.getAllByText('住建项目').length).toBeGreaterThan(0);
      expect(screen.getAllByText('职业培训').length).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('mock 模式会把合法业务属性透传给中央数据源', async () => {
    vi.useFakeTimers();

    try {
      render(
        <SmartTable
          mock
          mockType="project"
          ba_training_project="NEXUS-2026-AI"
          ba_trainning_title="AI-AGENT-ENGINEER"
          ba_trainning_type="CONTINUING-EDUCATION"
        />,
      );

      await act(async () => {
        vi.advanceTimersByTime(800);
      });

      expect(screen.getAllByText(/继续教育：/).length).toBeGreaterThan(0);
      expect(screen.getAllByText('继续教育').length).toBeGreaterThan(0);
      expect(screen.getAllByText('AI Agent 工程师').length).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('mock 模式会把 ba_region_scope 透传给属地 mock 数据源', async () => {
    vi.useFakeTimers();

    try {
      render(<SmartTable mock mockType="user" ba_region_scope="440000" />);

      await act(async () => {
        vi.advanceTimersByTime(800);
      });

      expect(screen.getAllByText(/广东省/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/13[5689]\*\*\*\*/).length).toBeGreaterThan(0);
    } finally {
      vi.useRealTimers();
    }
  });
});
