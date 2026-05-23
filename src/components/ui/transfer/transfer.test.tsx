import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Transfer } from './transfer';

const items = [
  { key: 'u1', title: '林予安', description: '食品安全管理员项目' },
  { key: 'u2', title: '周明轩', description: '继续医学教育项目' },
  { key: 'u3', title: '陈晓雨', description: '证书服务组' },
];

describe('UI Transfer', () => {
  it('moves selected source items into the target list', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Transfer dataSource={items} defaultTargetKeys={[]} onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox', { name: '选择 林予安' }));
    await user.click(screen.getByRole('button', { name: '移至右侧' }));

    const targetPanel = screen.getByTestId('ui-transfer-panel-target');

    expect(within(targetPanel).getByText('林予安')).toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledWith(['u1']);
  });

  it('loads central mock data when mock is enabled and no dataSource is provided', () => {
    render(<Transfer mock />);

    expect(screen.getByText('林予安')).toBeInTheDocument();
  });

  it('prefers real data over mock fallback', () => {
    render(<Transfer mock dataSource={[{ key: 'custom-1', title: '真实候选人' }]} />);

    expect(screen.getByText('真实候选人')).toBeInTheDocument();
    expect(screen.queryByText('林予安')).not.toBeInTheDocument();
  });

  it('selects a range with pointer drag before moving items', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Transfer dragSelect dataSource={items} defaultTargetKeys={[]} onChange={handleChange} />);

    fireEvent.pointerDown(screen.getByTestId('ui-transfer-option-source-u1'));
    fireEvent.pointerEnter(screen.getByTestId('ui-transfer-option-source-u2'));
    fireEvent.pointerUp(screen.getByTestId('ui-transfer-option-source-u2'));
    await user.click(screen.getByRole('button', { name: '移至右侧' }));

    const targetPanel = screen.getByTestId('ui-transfer-panel-target');

    expect(within(targetPanel).getByText('林予安')).toBeInTheDocument();
    expect(within(targetPanel).getByText('周明轩')).toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledWith(['u1', 'u2']);
  });

  it('selects all visible source panel items before moving them', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Transfer dataSource={items} defaultTargetKeys={[]} onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox', { name: '全选可选项' }));
    await user.click(screen.getByRole('button', { name: '移至右侧' }));

    const targetPanel = screen.getByTestId('ui-transfer-panel-target');

    expect(within(targetPanel).getByText('林予安')).toBeInTheDocument();
    expect(within(targetPanel).getByText('周明轩')).toBeInTheDocument();
    expect(within(targetPanel).getByText('陈晓雨')).toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledWith(['u1', 'u2', 'u3']);
  });

  it('selects a keyboard range with Shift and arrow keys', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Transfer dataSource={items} defaultTargetKeys={[]} onChange={handleChange} />);

    await user.click(screen.getByRole('checkbox', { name: '选择 林予安' }));
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
    await user.click(screen.getByRole('button', { name: '移至右侧' }));

    const targetPanel = screen.getByTestId('ui-transfer-panel-target');

    expect(within(targetPanel).getByText('林予安')).toBeInTheDocument();
    expect(within(targetPanel).getByText('周明轩')).toBeInTheDocument();
    expect(within(targetPanel).queryByText('陈晓雨')).not.toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledWith(['u1', 'u2']);
  });
});
