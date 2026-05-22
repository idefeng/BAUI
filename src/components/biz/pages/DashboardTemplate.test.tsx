import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DashboardTemplate, type DashboardMetric } from './DashboardTemplate';

describe('DashboardTemplate', () => {
  it('mock 模式渲染 4 格科技大屏指标卡和趋势分析占位区', () => {
    render(<DashboardTemplate mock />);

    expect(screen.getByTestId('dashboard-template-root')).toHaveClass('dark:bg-background-dark');
    expect(screen.getAllByTestId('dashboard-metric-card')).toHaveLength(4);
    expect(screen.getByText('运营驾驶舱')).toBeInTheDocument();
    expect(screen.getAllByText('趋势分析图表占位')).toHaveLength(2);
    expect(screen.getByTestId('dashboard-trend-panel')).toHaveClass('dark:border-primary-dark/30');
  });

  it('外部传入 metrics 时优先展示真实数据而不是 mock 数据', () => {
    const metrics: DashboardMetric[] = [
      { id: 'sales', label: '今日成交额', value: '¥ 82.6w', trend: 'up', trendText: '环比 +8.2%' },
      { id: 'orders', label: '订单数', value: '1,208', suffix: '单', trend: 'up', trendText: '实时增长' },
      { id: 'risk', label: '风险任务', value: 7, suffix: '项', trend: 'down', trendText: '下降 3 项' },
      { id: 'online', label: '在线用户', value: '3.4w', trend: 'up', trendText: '峰值在线' },
    ];

    render(<DashboardTemplate mock metrics={metrics} />);

    expect(screen.getByText('今日成交额')).toBeInTheDocument();
    expect(screen.getByText('¥ 82.6w')).toBeInTheDocument();
    expect(screen.queryByText('本周新增学员')).not.toBeInTheDocument();
  });
});
