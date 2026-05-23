import * as React from 'react';
import { Activity, Award, BookOpenCheck, LineChart, Radar, ShieldAlert, TrendingDown, TrendingUp } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockDashboardMetrics, type BaBusinessProps, type MockDashboardMetric } from '../../../utils/mock';
import { BrandLogo, BrandWatermark } from '../../ui/branding';
import { Card } from '../../ui/card';
import { ThemeToggle } from '../../ui/theme-toggle';

export type DashboardMetric = MockDashboardMetric;

export interface DashboardTemplateProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>, BaBusinessProps {
  /** 开启后从中央 mock 数据源生成 4 个大屏指标。 */
  mock?: boolean;
  /** 外部真实指标数据；传入后优先级高于 mock 数据。 */
  metrics?: DashboardMetric[];
  /** 页面主标题，适合业务系统替换为自己的驾驶舱名称。 */
  title?: React.ReactNode;
  /** 页面副标题，用于说明当前看板的数据范围或刷新策略。 */
  description?: React.ReactNode;
  /** 趋势图表区域标题；当前组件只提供占位视觉，不绑定具体图表库。 */
  trendTitle?: React.ReactNode;
}

const fallbackMetrics: DashboardMetric[] = [
  { id: 'fallback-learners', label: '活跃学员', value: 0, suffix: '人', trend: 'up', trendText: '等待接入' },
  { id: 'fallback-completion', label: '课程完课率', value: '0', suffix: '%', trend: 'up', trendText: '等待接入' },
  { id: 'fallback-certificate', label: '证书签发', value: 0, suffix: '张', trend: 'up', trendText: '等待接入' },
  { id: 'fallback-warning', label: '异常预警', value: 0, suffix: '项', trend: 'down', trendText: '等待接入' },
];

const metricIcons = [Activity, BookOpenCheck, Award, ShieldAlert];
const chartColumns = [32, 46, 58, 74, 66, 82, 92, 104, 118];

const formatMetricValue = (value: DashboardMetric['value']) =>
  typeof value === 'number' ? new Intl.NumberFormat('zh-CN').format(value) : value;

function DashboardMetricCard({ metric, index }: { metric: DashboardMetric; index: number }) {
  const Icon = metricIcons[index % metricIcons.length];
  const TrendIcon = metric.trend === 'down' ? TrendingDown : TrendingUp;

  return (
    <Card
      data-testid="dashboard-metric-card"
      className="group relative overflow-hidden border-primary/20 bg-surface/80 p-5 shadow-button backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 dark:border-primary-dark/25 dark:bg-surface-dark/70 dark:hover:border-primary-dark/45"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-primary/40 dark:bg-primary-dark/50" aria-hidden="true" />
      <div className="absolute right-4 top-4 size-20 rounded-full bg-primary-soft/50 blur-2xl transition-opacity duration-300 group-hover:opacity-80 dark:bg-primary-dark-soft/50" aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground dark:text-muted-dark-foreground">{metric.label}</p>
          <div className="flex flex-wrap items-end gap-2">
            <span className="text-3xl font-black leading-none tracking-normal text-foreground dark:text-foreground-dark">
              {formatMetricValue(metric.value)}
            </span>
            {metric.suffix ? (
              <span className="pb-1 text-sm font-semibold text-muted-foreground dark:text-muted-dark-foreground">
                {metric.suffix}
              </span>
            ) : null}
          </div>
        </div>
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary-soft text-primary shadow-sm dark:border-primary-dark/30 dark:bg-primary-dark-soft dark:text-primary-dark">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <div className="relative mt-5 flex items-center gap-2 text-xs font-semibold">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
            metric.trend === 'down'
              ? 'bg-danger-soft text-danger dark:bg-danger-dark-soft dark:text-danger-dark'
              : 'bg-success-soft text-success dark:bg-success-dark-soft dark:text-success-dark',
          )}
        >
          <TrendIcon className="size-3.5" aria-hidden="true" />
          {metric.trendText}
        </span>
        <span className="text-muted-foreground dark:text-muted-dark-foreground">实时更新</span>
      </div>
    </Card>
  );
}

function TrendPlaceholder({ title }: { title: React.ReactNode }) {
  return (
    <Card
      data-testid="dashboard-trend-panel"
      className="relative overflow-hidden border-primary/20 bg-surface/80 p-6 shadow-button backdrop-blur dark:border-primary-dark/30 dark:bg-surface-dark/70"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/50 via-transparent to-success-soft/40 dark:from-primary-dark-soft/35 dark:via-transparent dark:to-success-dark-soft/20" aria-hidden="true" />
      <div className="absolute inset-x-8 top-1/2 h-px bg-border/70 dark:bg-border-dark/70" aria-hidden="true" />
      <div className="absolute inset-y-8 left-1/3 w-px bg-border/70 dark:bg-border-dark/70" aria-hidden="true" />
      <div className="absolute inset-y-8 left-2/3 w-px bg-border/70 dark:bg-border-dark/70" aria-hidden="true" />
      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-medium text-primary dark:text-primary-dark">TREND ANALYSIS</p>
            <h3 className="mt-2 text-2xl font-bold tracking-normal text-foreground dark:text-foreground-dark">
              {title}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
              这里预留给折线图、面积图或实时流量趋势图；当前仅提供科技大屏图表占位视觉。
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary dark:border-primary-dark/30 dark:bg-primary-dark-soft dark:text-primary-dark">
            <Radar className="size-3.5" aria-hidden="true" />
            实时刷新
          </span>
        </div>

        <div className="relative min-h-72 overflow-hidden rounded-2xl border border-border bg-background/60 p-5 dark:border-border-dark dark:bg-background-dark/50">
          <div className="absolute inset-0 grid grid-rows-4" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="border-b border-border/70 dark:border-border-dark/70" />
            ))}
          </div>
          <div className="relative flex h-56 items-end gap-3">
            {chartColumns.map((height, index) => (
              <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-primary to-primary-dark opacity-80 shadow-button dark:from-primary-dark dark:to-success-dark"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{index + 1}</span>
              </div>
            ))}
          </div>
          <svg className="pointer-events-none absolute inset-x-5 top-12 h-40 w-[calc(100%-2.5rem)] text-success dark:text-success-dark" viewBox="0 0 640 180" preserveAspectRatio="none" aria-hidden="true">
            <polyline
              points="0,128 80,112 160,130 240,82 320,96 400,54 480,72 560,38 640,48"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full border border-primary/20 bg-surface/80 px-4 py-2 text-sm font-semibold text-primary shadow-button backdrop-blur dark:border-primary-dark/30 dark:bg-surface-dark/80 dark:text-primary-dark">
              趋势分析图表占位
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/** DashboardTemplate 是科技大屏风格的业务页面模板，适合作为运营驾驶舱首屏。 */
export function DashboardTemplate({
  ba_training_project,
  ba_trainning_title,
  ba_trainning_type,
  ba_region_scope,
  className,
  description = '聚合培训项目、学员活跃、证书签发和异常预警，适合大屏、首页与运营中心复用。',
  metrics,
  mock = false,
  title = '运营驾驶舱',
  trendTitle = '趋势分析图表占位',
  ...props
}: DashboardTemplateProps) {
  const businessProps = React.useMemo<BaBusinessProps>(
    () => ({ ba_training_project, ba_trainning_title, ba_trainning_type, ba_region_scope }),
    [ba_region_scope, ba_training_project, ba_trainning_title, ba_trainning_type],
  );
  const displayMetrics = React.useMemo(() => {
    if (metrics && metrics.length > 0) {
      return metrics.slice(0, 4);
    }

    if (mock) {
      return mockDashboardMetrics(businessProps);
    }

    return fallbackMetrics;
  }, [businessProps, metrics, mock]);

  return (
    <section
      {...props}
      data-testid="dashboard-template-root"
      className={cn(
        'relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-primary-soft to-secondary p-6 text-foreground dark:bg-background-dark dark:from-background-dark dark:via-surface-dark dark:to-primary-dark-soft dark:text-foreground-dark',
        className,
      )}
    >
      <div className="absolute -right-24 top-10 size-80 rounded-full bg-primary-soft/70 blur-3xl dark:bg-primary-dark-soft/35" aria-hidden="true" />
      <div className="absolute -left-20 bottom-20 size-72 rounded-full bg-success-soft/60 blur-3xl dark:bg-success-dark-soft/25" aria-hidden="true" />
      <BrandWatermark
        data-testid="dashboard-brand-watermark"
        text="NEXUS 内部资产"
        className="z-0 opacity-[0.045] dark:opacity-[0.08]"
      />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/20 bg-surface/70 p-6 shadow-button backdrop-blur dark:border-primary-dark/25 dark:bg-surface-dark/60 lg:flex-row lg:items-center">
          <div className="space-y-4">
            <BrandLogo data-testid="dashboard-brand-logo" variant="full" size="md" />
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary dark:border-primary-dark/30 dark:bg-primary-dark-soft dark:text-primary-dark">
              <LineChart className="size-3.5" aria-hidden="true" />
              BOAO DATA SCREEN
            </div>
            <div>
              <h2 className="text-3xl font-black leading-tight tracking-normal text-foreground dark:text-foreground-dark">
                {title}
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
                {description}
              </p>
            </div>
          </div>
          <div className="flex w-full max-w-sm flex-col items-start gap-4 lg:w-72 lg:items-end">
            <ThemeToggle />
            <div className="grid w-full grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-border bg-background/70 p-3 dark:border-border-dark dark:bg-background-dark/55">
                <p className="text-muted-foreground dark:text-muted-dark-foreground">刷新频率</p>
                <p className="mt-1 font-bold text-foreground dark:text-foreground-dark">5s</p>
              </div>
              <div className="rounded-2xl border border-border bg-background/70 p-3 dark:border-border-dark dark:bg-background-dark/55">
                <p className="text-muted-foreground dark:text-muted-dark-foreground">数据状态</p>
                <p className="mt-1 font-bold text-success dark:text-success-dark">在线</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {displayMetrics.map((metric, index) => (
            <DashboardMetricCard key={metric.id} metric={metric} index={index} />
          ))}
        </div>

        <TrendPlaceholder title={trendTitle} />
      </div>
    </section>
  );
}
