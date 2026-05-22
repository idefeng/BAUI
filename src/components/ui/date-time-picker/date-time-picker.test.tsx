import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DateTimePicker } from './date-time-picker';

describe('DateTimePicker', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('date 模式渲染 7x6 日期网格，并优雅展示上下月溢出日期', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <DateTimePicker
        type="date"
        value={new Date(2026, 4, 22)}
        placeholder="请选择日期"
        onChange={onChange}
      />,
    );

    expect(screen.getByRole('combobox', { name: '2026-05-22' })).toBeInTheDocument();

    await user.click(screen.getByRole('combobox', { name: '2026-05-22' }));

    expect(screen.getByText('2026年5月')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2026-04-26 非本月' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2026-06-06 非本月' })).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell')).toHaveLength(42);

    await user.click(screen.getByRole('button', { name: '2026-05-28' }));

    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(onChange.mock.calls[0][0]).toMatchObject({
      getFullYear: expect.any(Function),
    });
    expect(onChange.mock.calls[0][0].getFullYear()).toBe(2026);
    expect(onChange.mock.calls[0][0].getMonth()).toBe(4);
    expect(onChange.mock.calls[0][0].getDate()).toBe(28);
  });

  it('time 模式展示时分秒三列并返回格式化时间字符串', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<DateTimePicker type="time" value="14:30:00" onChange={onChange} />);

    expect(screen.getByRole('combobox', { name: '14:30:00' })).toBeInTheDocument();

    await user.click(screen.getByRole('combobox', { name: '14:30:00' }));

    expect(screen.getByText('时')).toBeInTheDocument();
    expect(screen.getByText('分')).toBeInTheDocument();
    expect(screen.getByText('秒')).toBeInTheDocument();

    const minuteColumn = screen.getByRole('listbox', { name: '选择分钟' });
    await user.click(within(minuteColumn).getByRole('option', { name: '45 分钟' }));

    expect(onChange).toHaveBeenCalledWith('14:45:00');
  });

  it('datetime 模式同时提供日期面板和时间滚轮并返回 Date 对象', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<DateTimePicker type="datetime" value={new Date(2026, 4, 22, 14, 30, 0)} onChange={onChange} />);

    expect(screen.getByRole('combobox', { name: '2026-05-22 14:30:00' })).toBeInTheDocument();

    await user.click(screen.getByRole('combobox', { name: '2026-05-22 14:30:00' }));
    await user.click(screen.getByRole('button', { name: '2026-05-29' }));

    expect(onChange).toHaveBeenCalledWith(expect.any(Date));
    expect(onChange.mock.calls[0][0].getFullYear()).toBe(2026);
    expect(onChange.mock.calls[0][0].getMonth()).toBe(4);
    expect(onChange.mock.calls[0][0].getDate()).toBe(29);
    expect(onChange.mock.calls[0][0].getHours()).toBe(14);
    expect(onChange.mock.calls[0][0].getMinutes()).toBe(30);
  });

  it('支持一键清除当前值', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<DateTimePicker type="date" value={new Date(2026, 4, 22)} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '清除选择' }));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('mock 模式未传 value 时自动生成未来排课时间并回显', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 22, 9, 0, 0));

    render(<DateTimePicker type="datetime" mock placeholder="请选择排课时间" />);

    expect(screen.getByRole('combobox', { name: '2026-05-23 14:30:00' })).toBeInTheDocument();
  });
});
