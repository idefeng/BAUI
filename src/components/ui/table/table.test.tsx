import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Table } from './table';

interface ProjectRow {
  id: string;
  name: string;
  status: string;
}

const columns = [
  { key: 'name', title: '项目名称', dataIndex: 'name' as const },
  { key: 'status', title: '状态', dataIndex: 'status' as const },
];

describe('Table', () => {
  it('renders columns and row data without business toolbar behavior', () => {
    render(
      <Table<ProjectRow>
        rowKey="id"
        columns={columns}
        data={[
          { id: 'project-1', name: '食品安全管理员项目', status: '进行中' },
          { id: 'project-2', name: '继续医学教育项目', status: '待开班' },
        ]}
      />,
    );

    expect(screen.getByRole('columnheader', { name: '项目名称' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '食品安全管理员项目' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '待开班' })).toBeInTheDocument();
  });

  it('supports row selection and reports selected rows', async () => {
    const user = userEvent.setup();
    const handleSelectionChange = vi.fn();

    render(
      <Table<ProjectRow>
        rowKey="id"
        selectable
        columns={columns}
        data={[
          { id: 'project-1', name: '食品安全管理员项目', status: '进行中' },
          { id: 'project-2', name: '继续医学教育项目', status: '待开班' },
        ]}
        onSelectionChange={handleSelectionChange}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: '选择 食品安全管理员项目' }));

    expect(handleSelectionChange).toHaveBeenCalledWith(
      ['project-1'],
      [{ id: 'project-1', name: '食品安全管理员项目', status: '进行中' }],
    );
  });

  it('uses central mock rows only when real data is absent', () => {
    render(<Table mock data={[{ id: 'real-1', name: '真实项目', status: '已发布' }]} columns={columns} rowKey="id" />);

    expect(screen.getByRole('cell', { name: '真实项目' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: '食品安全管理员项目' })).not.toBeInTheDocument();
  });

  it('sorts rows with a sortable column header', async () => {
    const user = userEvent.setup();

    render(
      <Table<ProjectRow>
        rowKey="id"
        columns={[{ key: 'name', title: '项目名称', dataIndex: 'name', sortable: true }]}
        data={[
          { id: 'project-2', name: '继续医学教育项目', status: '待开班' },
          { id: 'project-1', name: '食品安全管理员项目', status: '进行中' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: '按 项目名称 升序排序' }));

    const rows = screen.getAllByRole('row');

    expect(within(rows[1]).getByRole('cell', { name: '继续医学教育项目' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '按 项目名称 降序排序' }));

    const descendingRows = screen.getAllByRole('row');

    expect(within(descendingRows[1]).getByRole('cell', { name: '食品安全管理员项目' })).toBeInTheDocument();
  });

  it('applies sticky offsets for fixed columns', () => {
    render(
      <Table<ProjectRow>
        rowKey="id"
        columns={[
          { key: 'name', title: '项目名称', dataIndex: 'name', fixed: 'left', width: 180 },
          { key: 'status', title: '状态', dataIndex: 'status', fixed: 'right', width: 120 },
        ]}
        data={[{ id: 'project-1', name: '食品安全管理员项目', status: '进行中' }]}
      />,
    );

    expect(screen.getByTestId('ui-table-head-name')).toHaveStyle({ left: '0px', position: 'sticky' });
    expect(screen.getByTestId('ui-table-cell-project-1-status')).toHaveStyle({ position: 'sticky', right: '0px' });
  });

  it('renders only the requested virtual window', () => {
    render(
      <Table<ProjectRow>
        rowKey="id"
        virtual
        virtualVisibleCount={2}
        columns={columns}
        data={[
          { id: 'project-1', name: '食品安全管理员项目', status: '进行中' },
          { id: 'project-2', name: '继续医学教育项目', status: '待开班' },
          { id: 'project-3', name: '睡眠技师项目', status: '已结项' },
        ]}
      />,
    );

    expect(screen.getByTestId('ui-table-virtual-window')).toHaveAttribute('aria-rowcount', '3');
    expect(screen.getByRole('cell', { name: '食品安全管理员项目' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '继续医学教育项目' })).toBeInTheDocument();
    expect(screen.queryByRole('cell', { name: '睡眠技师项目' })).not.toBeInTheDocument();
  });

  it('expands rows with custom detail content', async () => {
    const user = userEvent.setup();
    const handleExpandedChange = vi.fn();
    const firstRow = { id: 'project-1', name: '食品安全管理员项目', status: '进行中' };

    render(
      <Table<ProjectRow>
        rowKey="id"
        expandable
        columns={columns}
        data={[firstRow]}
        onExpandedChange={handleExpandedChange}
        renderExpandedRow={(record) => <div>开班时间：{record.name} / 2026-06-01</div>}
      />,
    );

    expect(screen.queryByText('开班时间：食品安全管理员项目 / 2026-06-01')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '展开 食品安全管理员项目' }));

    expect(screen.getByText('开班时间：食品安全管理员项目 / 2026-06-01')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '收起 食品安全管理员项目' })).toBeInTheDocument();
    expect(handleExpandedChange).toHaveBeenCalledWith(['project-1'], [firstRow]);
  });
});
