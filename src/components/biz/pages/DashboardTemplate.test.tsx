import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DashboardTemplate, type DashboardMetric } from './DashboardTemplate';

describe('DashboardTemplate', () => {
  it('mock 模式渲染 4 格科技大屏指标卡和趋势分析占位区', () => {
    render(<DashboardTemplate mock />);

    expect(screen.getByTestId('dashboard-template-root')).toHaveClass('dark:bg-background-dark');
    expect(screen.getByTestId('dashboard-brand-logo')).toHaveAttribute('aria-label', '博奥教育 / ETLCHINA 品牌标识');
    expect(screen.getByTestId('dashboard-brand-watermark')).toHaveTextContent('ETLCHINA 内部资产');
    expect(screen.getAllByTestId('dashboard-metric-card')).toHaveLength(4);
    expect(screen.getByText('运营驾驶舱')).toBeInTheDocument();
    expect(screen.getAllByText('趋势分析图表占位')).toHaveLength(2);
    expect(screen.getByTestId('dashboard-trend-panel')).toHaveClass('dark:border-primary-dark/30');
  });

  it('继续教育业务属性会清洗大屏指标为学分和证书维度', () => {
    render(
      <DashboardTemplate
        mock
        ba_training_project="ETLCHINA-2026-AI"
        ba_trainning_title="AI-AGENT-ENGINEER"
        ba_trainning_type="CONTINUING-EDUCATION"
      />,
    );

    expect(screen.getByText('年度继续教育学分')).toBeInTheDocument();
    expect(screen.getByText('学分达标率')).toBeInTheDocument();
    expect(screen.getByText('ETLCHINA 2026 AI 实训项目')).toBeInTheDocument();
  });

  it('ba_region_scope 会让大屏指标切换为属地数据', () => {
    render(<DashboardTemplate mock ba_region_scope="440000" />);

    expect(screen.getByText('广东省活跃学员')).toBeInTheDocument();
    expect(screen.getByText('广东省分部项目')).toBeInTheDocument();
    expect(screen.getAllByText(/广东省/).length).toBeGreaterThan(1);
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

  it('finance 页面类型渲染三栏财务驾驶舱和交易列表', () => {
    render(<DashboardTemplate mock pageType="finance" />);

    expect(screen.getByTestId('dashboard-finance-shell')).toHaveClass('bg-secondary');
    expect(screen.getByTestId('finance-balance-chart')).toHaveClass('dark:bg-surface-dark');
    expect(screen.getByText('Balance overview')).toBeInTheDocument();
    expect(screen.getByText('$12,450')).toBeInTheDocument();
    expect(screen.getByText('My card')).toBeInTheDocument();
    expect(screen.getAllByTestId('finance-goal-row')).toHaveLength(4);
    expect(screen.getAllByTestId('finance-transaction-row')).toHaveLength(7);
  });
});
