import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Statistic } from './statistic';

describe('Statistic', () => {
  it('渲染标题、前缀、数值和后缀，并突出显示数值', () => {
    render(<Statistic title="本月营收" prefix="¥" value={128600} suffix="元" />);

    expect(screen.getByText('本月营收')).toHaveClass('text-muted-foreground');
    expect(screen.getByText('128,600')).toHaveClass('text-3xl');
    expect(screen.getByText('¥')).toBeInTheDocument();
    expect(screen.getByText('元')).toBeInTheDocument();
  });

  it('trend 为 up 时展示绿色上升趋势', () => {
    render(<Statistic title="报名人数" value={286} suffix="人" trend="up" trendText="同比 +12.6%" />);

    expect(screen.getByText('同比 +12.6%')).toHaveClass('text-success');
    expect(screen.getByLabelText('上升趋势')).toBeInTheDocument();
  });

  it('trend 为 down 时展示红色下降趋势', () => {
    render(<Statistic title="未完成任务" value={18} suffix="项" trend="down" trendText="环比 -4.8%" />);

    expect(screen.getByText('环比 -4.8%')).toHaveClass('text-danger');
    expect(screen.getByLabelText('下降趋势')).toBeInTheDocument();
  });

  it('mock 开启且未传业务字段时自动生成运营指标', () => {
    render(<Statistic mock />);

    expect(screen.getByTestId('boao-statistic')).toHaveTextContent('本周新增学员');
    expect(screen.getByTestId('boao-statistic')).toHaveTextContent('同比');
  });
});
