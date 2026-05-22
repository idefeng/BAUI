import * as React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockStatistic } from '../../../utils/mock';
import { uiStatusStyles, uiStyles, type UiTrend } from '../shared/styles';

export type StatisticTrend = UiTrend;

export interface StatisticProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'prefix' | 'title'> {
  /** 指标名称，通常展示为控制台或大屏的数据标题。 */
  title?: React.ReactNode;
  /** 指标数值；数字会默认加入千分位。 */
  value?: number | string;
  /** 数值前缀，例如货币符号。 */
  prefix?: React.ReactNode;
  /** 数值后缀，例如百分比、人数或单位。 */
  suffix?: React.ReactNode;
  /** 趋势方向；up 展示绿色上升箭头，down 展示红色下降箭头。 */
  trend?: StatisticTrend;
  /** 趋势说明文案，例如“同比 +12.6%”。 */
  trendText?: React.ReactNode;
  /** 自定义数值格式化，适合业务侧处理小数或缩写。 */
  formatter?: (value: number | string) => React.ReactNode;
  /** 启用运营指标 mock；仅在未传 title/value 等字段时兜底接管。 */
  mock?: boolean;
  /** Mock 数据偏移，用于 Storybook 展示不同指标。 */
  mockSeed?: number;
}

const numberFormatter = new Intl.NumberFormat('zh-CN');

const formatValue = (value: number | string, formatter?: StatisticProps['formatter']) => {
  if (formatter) {
    return formatter(value);
  }

  return typeof value === 'number' ? numberFormatter.format(value) : value;
};

const trendIconMap: Record<StatisticTrend, React.ReactNode> = {
  up: <ArrowUpRight aria-label="上升趋势" className="size-4" />,
  down: <ArrowDownRight aria-label="下降趋势" className="size-4" />,
};

/** Statistic 用于控制台和数据大屏的核心运营指标展示。 */
export const Statistic = React.forwardRef<HTMLDivElement, StatisticProps>(
  (
    {
      className,
      formatter,
      mock = false,
      mockSeed = 0,
      prefix,
      suffix,
      title,
      trend,
      trendText,
      value,
      ...props
    },
    ref,
  ) => {
    const mockData = React.useMemo(() => (mock ? mockStatistic(mockSeed) : undefined), [mock, mockSeed]);
    const displayTitle = title ?? mockData?.title;
    const displayValue = value ?? mockData?.value ?? 0;
    const displayPrefix = prefix ?? mockData?.prefix;
    const displaySuffix = suffix ?? mockData?.suffix;
    const displayTrend = trend ?? mockData?.trend;
    const displayTrendText = trendText ?? mockData?.trendText;

    return (
      <div
        ref={ref}
        data-testid="boao-statistic"
        className={cn(uiStyles.panelSurface, 'p-5', className)}
        {...props}
      >
        {displayTitle ? (
          <div className={cn('text-sm font-medium', uiStyles.textMuted)}>
            {displayTitle}
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap items-end gap-2">
          {displayPrefix ? (
            <span className={cn('pb-1 text-base font-semibold', uiStyles.textMuted)}>
              {displayPrefix}
            </span>
          ) : null}
          <span className={cn('text-3xl font-bold leading-none tracking-normal', uiStyles.textForeground)}>
            {formatValue(displayValue, formatter)}
          </span>
          {displaySuffix ? (
            <span className={cn('pb-1 text-sm font-semibold', uiStyles.textMuted)}>
              {displaySuffix}
            </span>
          ) : null}
          {displayTrend ? (
            <span className={cn('mb-1 inline-flex items-center gap-1 rounded-lg text-xs font-semibold', uiStatusStyles.trend[displayTrend])}>
              {trendIconMap[displayTrend]}
              {displayTrendText}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);

Statistic.displayName = 'Statistic';
