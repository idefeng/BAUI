import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { LearningProfile } from './learning-profile';

describe('LearningProfile', () => {
  it('mock 模式先展示 600ms 全局骨架屏，再渲染学习档案三段布局', async () => {
    vi.useFakeTimers();

    try {
      render(<LearningProfile studentId="student-it-001" mock />);

      expect(screen.getByTestId('learning-profile-skeleton')).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(600);
      });

      expect(screen.queryByTestId('learning-profile-skeleton')).not.toBeInTheDocument();
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('总已学学时')).toBeInTheDocument();
      expect(screen.getByText('156')).toBeInTheDocument();
      expect(screen.getByText('已获证书')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('进行中课程')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('年度学分')).toBeInTheDocument();
      expect(screen.getByText('18')).toBeInTheDocument();
      expect(screen.getByText('加入 IT 工程化培训计划')).toBeInTheDocument();
      expect(screen.getByText('通过《Next.js全栈工程化》考核')).toBeInTheDocument();
      expect(screen.getByText('获得《培训合格证明》')).toBeInTheDocument();
      expect(screen.getByTestId('smart-table-root')).toBeInTheDocument();
      expect(screen.getByText('Next.js全栈工程化')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('证书时间线节点可打开 CertificateTemplate 预览弹窗', async () => {
    const user = userEvent.setup();

    render(<LearningProfile studentId="student-it-001" />);

    const certificateEvent = screen.getByTestId('learning-profile-timeline-event-certificate-qualified');

    await user.click(within(certificateEvent).getByRole('button', { name: '查看证书' }));

    expect(screen.getByRole('dialog', { name: '证书预览' })).toBeInTheDocument();
    expect(screen.getByTestId('certificate-paper')).toBeInTheDocument();
    expect(screen.getByText('成绩合格，特发此证')).toBeInTheDocument();
  });

  it('根容器与摘要卡片保留暗黑模式舒适阅读样式', () => {
    render(<LearningProfile studentId="student-it-001" />);

    expect(screen.getByTestId('learning-profile-root').className).toContain('dark:');
    expect(screen.getByTestId('learning-profile-summary-card-totalHours').className).toContain('dark:');
  });
});
