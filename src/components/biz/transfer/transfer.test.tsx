import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Transfer, type TransferItem } from './transfer';

const dataSource: TransferItem[] = [
  { key: 'student-1', title: '林予安', description: '前端工程师 / 技术中心' },
  { key: 'student-2', title: '周明轩', description: 'Java 工程师 / 技术中心' },
  { key: 'student-3', title: '陈晓雨', description: 'AI Agent 产品经理', disabled: true },
];

describe('Transfer', () => {
  it('选择左侧项目后可移动到右侧并回传最新 targetKeys', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Transfer dataSource={dataSource} targetKeys={[]} onChange={onChange} />);

    expect(screen.getByRole('button', { name: '移至右侧' })).toBeDisabled();

    await user.click(screen.getByRole('checkbox', { name: '林予安' }));

    expect(screen.getByRole('button', { name: '移至右侧' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: '移至右侧' }));

    expect(onChange).toHaveBeenCalledWith(['student-1']);
  });

  it('支持搜索过滤左右列表', async () => {
    const user = userEvent.setup();

    render(
      <Transfer
        dataSource={dataSource}
        targetKeys={['student-2']}
        titles={['未分配学员', '已分配学员']}
        onChange={() => undefined}
      />,
    );

    await user.type(screen.getByPlaceholderText('搜索未分配学员'), '前端');

    const sourcePanel = screen.getByTestId('transfer-panel-source');

    expect(within(sourcePanel).getByText('林予安')).toBeInTheDocument();
    expect(within(sourcePanel).queryByText('陈晓雨')).not.toBeInTheDocument();

    await user.type(screen.getByPlaceholderText('搜索已分配学员'), 'Java');

    expect(screen.getByText('周明轩')).toBeInTheDocument();
  });

  it('全选只会选择当前面板内未禁用项目并更新计数', async () => {
    const user = userEvent.setup();

    render(<Transfer dataSource={dataSource} targetKeys={[]} onChange={() => undefined} />);

    await user.click(screen.getByRole('checkbox', { name: '全选 未分配' }));

    expect(screen.getByTestId('transfer-count-source')).toHaveTextContent('已选 2/2 项');
  });

  it('mock 模式无外部数据时生成 15 条数据并默认放入右侧 3 条', () => {
    render(<Transfer mock titles={['候选权限', '已授权限']} />);

    expect(screen.getByTestId('transfer-panel-source')).toHaveTextContent('候选权限');
    expect(screen.getByTestId('transfer-panel-target')).toHaveTextContent('已授权限');
    expect(screen.getByTestId('transfer-total')).toHaveTextContent('共 15 项');
    expect(screen.getByTestId('transfer-count-target')).toHaveTextContent('/3 项');
  });

  it('包含现代圆角面板和暗黑模式下沉背景', () => {
    render(<Transfer dataSource={dataSource} targetKeys={[]} onChange={() => undefined} />);

    expect(screen.getByTestId('transfer-panel-source').className).toContain('rounded-2xl');
    expect(screen.getByTestId('transfer-panel-source').className).toContain('dark:bg-slate-900');
    expect(screen.getByTestId('transfer-panel-target').className).toContain('dark:bg-slate-900');
  });
});
