import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Timeline } from './timeline';

const items = [
  { title: '提交报名资料', description: '学员完成基础信息填写。', time: '09:30', status: 'success' as const },
  { title: '管理员审核', description: '等待项目负责人复核。', time: '10:15', status: 'process' as const },
  { title: '证书签发', description: '审核通过后自动生成证书。', status: 'wait' as const },
];

describe('Timeline', () => {
  it('渲染时间轴标题、描述和时间', () => {
    render(<Timeline items={items} />);

    expect(screen.getByText('提交报名资料')).toHaveClass('text-foreground');
    expect(screen.getByText('学员完成基础信息填写。')).toHaveClass('text-muted-foreground');
    expect(screen.getByText('09:30')).toHaveClass('text-muted-foreground');
  });

  it('按状态渲染语义色节点', () => {
    render(<Timeline items={items} />);

    expect(screen.getByLabelText('提交报名资料 状态')).toHaveClass('bg-success');
    expect(screen.getByLabelText('管理员审核 状态')).toHaveClass('bg-primary');
  });

  it('支持 pending 尾部节点', () => {
    render(<Timeline items={items} pending="等待证书签发" />);

    expect(screen.getByText('等待证书签发')).toHaveClass('text-muted-foreground');
  });
});
