import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from './progress';

describe('Progress', () => {
  it('基于 Radix Progress 渲染数值、轨道和科技蓝进度条', () => {
    render(<Progress value={75} label="课程完成率" />);

    expect(screen.getByRole('progressbar', { name: '课程完成率' })).toHaveAttribute('aria-valuenow', '75');
    expect(screen.getByText('75%')).toHaveClass('text-foreground');
    expect(screen.getByTestId('boao-progress-indicator')).toHaveClass('bg-primary');
  });

  it('success 状态使用绿色进度条', () => {
    render(<Progress value={100} status="success" label="证书签发完成率" />);

    expect(screen.getByTestId('boao-progress-indicator')).toHaveClass('bg-success');
  });

  it('exception 状态使用红色进度条', () => {
    render(<Progress value={42} status="exception" label="异常任务占比" />);

    expect(screen.getByTestId('boao-progress-indicator')).toHaveClass('bg-danger');
  });

  it('animated 开启后展示平滑光浪效果', () => {
    render(<Progress value={68} animated label="加载进度" />);

    expect(screen.getByTestId('boao-progress-indicator')).toHaveClass('overflow-hidden');
    expect(screen.getByTestId('boao-progress-shine')).toHaveClass('animate-progress-shine');
  });

  it('mock 开启且未传 value 时自动生成培训业务进度', () => {
    render(<Progress mock />);

    expect(screen.getByRole('progressbar')).toHaveAccessibleName('课程平均完成率');
    expect(screen.getByText('76%')).toBeInTheDocument();
  });
});
