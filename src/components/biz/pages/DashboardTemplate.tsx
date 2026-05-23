import * as React from 'react';
import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  BookOpenCheck,
  BriefcaseBusiness,
  ChevronDown,
  ChevronsLeft,
  CreditCard,
  Gauge,
  History,
  LayoutDashboard,
  LineChart,
  MoreHorizontal,
  Pencil,
  PiggyBank,
  Plus,
  Radar,
  Search,
  Send,
  Settings,
  ShieldAlert,
  Target,
  TrendingDown,
  TrendingUp,
  UserRound,
  Wallet,
  WalletCards,
  Zap,
} from 'lucide-react';

import { cn } from '../../../lib/utils';
import {
  mockDashboardMetrics,
  mockFinanceDashboardData,
  type BaBusinessProps,
  type MockDashboardMetric,
  type MockFinanceDashboardData,
  type MockFinanceGoal,
  type MockFinancePaymentContact,
  type MockFinanceTone,
  type MockFinanceTransaction,
} from '../../../utils/mock';
import { BrandLogo, BrandWatermark } from '../../ui/branding';
import { Card } from '../../ui/card';
import { ThemeToggle } from '../../ui/theme-toggle';

export type DashboardMetric = MockDashboardMetric;
export type DashboardTemplatePageType = 'data-screen' | 'finance';
export type FinanceDashboardData = MockFinanceDashboardData;

export interface DashboardTemplateProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>, BaBusinessProps {
  /** 开启后从中央 mock 数据源生成 4 个大屏指标。 */
  mock?: boolean;
  /** 页面类型；默认保持原有科技大屏，finance 用于财务经营驾驶舱。 */
  pageType?: DashboardTemplatePageType;
  /** 外部真实指标数据；传入后优先级高于 mock 数据。 */
  metrics?: DashboardMetric[];
  /** finance 页面类型的外部真实数据；传入后优先级高于中央 mock 数据。 */
  financeData?: FinanceDashboardData;
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
const financeNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Accounts', icon: UserRound },
  { label: 'Transactions', icon: ArrowUpRight, expanded: true },
  { label: 'Cash flow', icon: Wallet },
  { label: 'Budget', icon: PiggyBank },
  { label: 'Investments', icon: BriefcaseBusiness },
];
const financeNavChildren = [
  { label: 'History', count: 19 },
  { label: 'Integration' },
  { label: 'Reports' },
];
const financeSupportItems = [
  { label: 'Learning center', icon: BookOpen },
  { label: 'Support', icon: Settings },
];
const financeActions = [
  { label: 'Top up', icon: WalletCards },
  { label: 'Send', icon: Send },
  { label: 'Request', icon: ArrowDownLeft },
  { label: 'History', icon: History },
  { label: 'More', icon: MoreHorizontal },
];
const financeToneStyles = {
  primary: 'bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark',
  success: 'bg-success-soft text-success dark:bg-success-dark-soft dark:text-success-dark',
  warning: 'bg-warning-soft text-warning dark:bg-warning-dark-soft dark:text-warning-dark',
  danger: 'bg-danger-soft text-danger dark:bg-danger-dark-soft dark:text-danger-dark',
  gray: 'bg-secondary text-secondary-foreground dark:bg-secondary-dark dark:text-secondary-dark-foreground',
} satisfies Record<MockFinanceTone, string>;
const financeProgressStyles = {
  primary: 'bg-primary dark:bg-primary-dark',
  success: 'bg-success dark:bg-success-dark',
  warning: 'bg-warning dark:bg-warning-dark',
  danger: 'bg-danger dark:bg-danger-dark',
  gray: 'bg-muted-foreground dark:bg-muted-dark-foreground',
} satisfies Record<MockFinanceTone, string>;
const financeTextStyles = {
  primary: 'text-primary dark:text-primary-dark',
  success: 'text-success dark:text-success-dark',
  warning: 'text-warning dark:text-warning-dark',
  danger: 'text-danger dark:text-danger-dark',
  gray: 'text-muted-foreground dark:text-muted-dark-foreground',
} satisfies Record<MockFinanceTone, string>;

const formatMetricValue = (value: DashboardMetric['value']) =>
  typeof value === 'number' ? new Intl.NumberFormat('zh-CN').format(value) : value;

const formatFinanceNumber = (value: number) => `$${new Intl.NumberFormat('en-US').format(value)}`;

const getPercent = (current: number, target: number) => {
  if (target <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
};

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

function FinanceSidebar() {
  return (
    <aside
      className="flex min-h-full flex-col rounded-3xl bg-surface p-5 text-foreground shadow-sm dark:bg-surface-dark dark:text-foreground-dark"
      aria-label="Finance dashboard navigation"
    >
      <div className="flex items-center gap-3 px-1 py-2">
        <BrandLogo variant="icon" size="sm" />
        <span className="text-lg font-black tracking-normal">BA Finance</span>
      </div>

      <nav className="mt-6 space-y-2">
        {financeNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label}>
              <button
                type="button"
                className={cn(
                  'flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-semibold transition-colors',
                  item.active
                    ? 'bg-secondary text-foreground shadow-sm dark:bg-secondary-dark dark:text-foreground-dark'
                    : 'text-muted-foreground hover:bg-secondary-hover hover:text-foreground dark:text-muted-dark-foreground dark:hover:bg-secondary-dark-hover dark:hover:text-foreground-dark',
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.expanded ? <ChevronDown className="size-4 shrink-0" aria-hidden="true" /> : null}
              </button>
              {item.expanded ? (
                <div className="ml-7 mt-2 space-y-1 border-l border-border pl-4 dark:border-border-dark">
                  {financeNavChildren.map((child) => (
                    <button
                      key={child.label}
                      type="button"
                      className="flex h-8 w-full items-center justify-between rounded-xl px-2 text-left text-sm text-foreground transition-colors hover:bg-secondary-hover dark:text-foreground-dark dark:hover:bg-secondary-dark-hover"
                    >
                      <span>{child.label}</span>
                      {child.count ? (
                        <span className="inline-flex min-w-6 justify-center rounded-full bg-foreground px-2 py-0.5 text-xs font-bold text-background dark:bg-foreground-dark dark:text-background-dark">
                          {child.count}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-border pt-6 dark:border-border-dark">
        {financeSupportItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className="flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-left text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary-hover hover:text-foreground dark:text-muted-dark-foreground dark:hover:bg-secondary-dark-hover dark:hover:text-foreground-dark"
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      <Card className="mt-auto border-border bg-background p-4 shadow-none dark:border-border-dark dark:bg-background-dark">
        <div className="flex items-start justify-between">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-foreground text-background dark:bg-foreground-dark dark:text-background-dark">
            <Zap className="size-5" aria-hidden="true" />
          </span>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary-hover hover:text-foreground dark:border-border-dark dark:text-muted-dark-foreground dark:hover:bg-secondary-dark-hover dark:hover:text-foreground-dark"
            aria-label="Close upgrade panel"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>
        </div>
        <h3 className="mt-5 text-xl font-black tracking-normal">Upgrade to Pro!</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
          Full financial insights with analytics and graphs.
        </p>
        <button
          type="button"
          className="mt-4 h-11 w-full rounded-xl bg-foreground text-sm font-bold text-background transition-colors hover:bg-foreground/90 dark:bg-foreground-dark dark:text-background-dark dark:hover:bg-foreground-dark/90"
        >
          Upgrade now
        </button>
      </Card>

      <button
        type="button"
        className="mt-5 flex items-center gap-2 px-2 text-sm font-semibold text-muted-foreground hover:text-foreground dark:text-muted-dark-foreground dark:hover:text-foreground-dark"
      >
        <ChevronsLeft className="size-4" aria-hidden="true" />
        Collapse sidebar
      </button>
    </aside>
  );
}

function FinanceTopbar() {
  return (
    <header className="grid gap-3 lg:grid-cols-[minmax(16rem,26rem)_1fr] lg:items-center">
      <label className="flex h-12 items-center gap-3 rounded-2xl bg-surface px-4 text-sm text-muted-foreground shadow-sm dark:bg-surface-dark dark:text-muted-dark-foreground">
        <Search className="size-5 shrink-0 text-foreground dark:text-foreground-dark" aria-hidden="true" />
        <span className="sr-only">Quick search</span>
        <input
          className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground dark:text-foreground-dark dark:placeholder:text-muted-dark-foreground"
          placeholder="Quick search"
        />
      </label>
      <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
        {[Bell, Settings].map((Icon, index) => (
          <button
            key={index}
            type="button"
            className="inline-flex size-12 items-center justify-center rounded-2xl bg-surface text-foreground shadow-sm transition-colors hover:bg-secondary-hover dark:bg-surface-dark dark:text-foreground-dark dark:hover:bg-secondary-dark-hover"
            aria-label={index === 0 ? 'Open notifications' : 'Open settings'}
          >
            <Icon className="size-5" aria-hidden="true" />
          </button>
        ))}
        <div className="flex h-12 min-w-0 items-center gap-3 rounded-2xl bg-surface px-4 shadow-sm dark:bg-surface-dark">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-success-soft text-xs font-black text-success dark:bg-success-dark-soft dark:text-success-dark">
            MJ
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground dark:text-foreground-dark">Michael Johnson</p>
            <p className="truncate text-xs text-muted-foreground dark:text-muted-dark-foreground">
              m.johnson@finex.com
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-12 items-center gap-2 rounded-2xl bg-surface px-4 text-sm font-bold text-foreground shadow-sm transition-colors hover:bg-secondary-hover dark:bg-surface-dark dark:text-foreground-dark dark:hover:bg-secondary-dark-hover"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add widget
        </button>
      </div>
    </header>
  );
}

function FinanceBalanceOverview({ data }: { data: FinanceDashboardData }) {
  const maxValue = Math.max(...data.chart.map((point) => point.savings + point.income));

  return (
    <Card
      data-testid="finance-balance-chart"
      className="grid gap-6 border-transparent bg-surface p-6 shadow-sm dark:bg-surface-dark xl:grid-cols-[minmax(0,1fr)_15rem]"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-4xl font-black leading-none tracking-normal text-foreground dark:text-foreground-dark">
              {data.balance}
            </p>
            <p className="mt-2 text-sm text-muted-foreground dark:text-muted-dark-foreground">Balance overview</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark"
            >
              7d
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark"
              aria-label="Show bar chart"
            >
              <LineChart className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground dark:border-border-dark dark:bg-background-dark dark:text-muted-dark-foreground"
              aria-label="Show trend chart"
            >
              <Gauge className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-4 text-xs text-muted-foreground dark:text-muted-dark-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-sm bg-primary dark:bg-primary-dark" aria-hidden="true" />
            Savings
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-sm bg-success dark:bg-success-dark" aria-hidden="true" />
            Income
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-3 rounded-sm bg-warning dark:bg-warning-dark" aria-hidden="true" />
            Expenses
          </span>
        </div>

        <div className="mt-6 grid h-72 grid-cols-[2rem_minmax(0,1fr)] gap-4">
          <div className="flex flex-col justify-between py-2 text-xs text-muted-foreground dark:text-muted-dark-foreground">
            <span>30</span>
            <span>20</span>
            <span>10</span>
            <span>0</span>
            <span>-10</span>
          </div>
          <div className="relative">
            <div className="absolute inset-0 grid grid-rows-4" aria-hidden="true">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="border-b border-border/70 dark:border-border-dark/70" />
              ))}
            </div>
            <div className="relative grid h-full grid-cols-7 items-end gap-3 pb-8">
              {data.chart.map((point) => {
                const positiveHeight = Math.max(16, ((point.savings + point.income) / maxValue) * 100);
                const savingsHeight = Math.max(12, (point.savings / maxValue) * 100);
                const incomeHeight = Math.max(12, (point.income / maxValue) * 100);
                const expenseHeight = Math.max(10, (point.expenses / maxValue) * 55);

                return (
                  <div key={point.label} className="flex h-full min-w-0 flex-col items-center justify-end gap-2">
                    <div className="flex h-44 w-full max-w-16 flex-col justify-end">
                      <div
                        className={cn(
                          'w-full overflow-hidden rounded-xl',
                          point.active
                            ? 'bg-success-soft dark:bg-success-dark-soft'
                            : 'bg-muted dark:bg-muted-dark',
                        )}
                        style={{ height: `${positiveHeight}%` }}
                      >
                        {point.active ? (
                          <>
                            <div
                              className="w-full bg-primary/90 dark:bg-primary-dark/90"
                              style={{ height: `${savingsHeight}%` }}
                            />
                            <div
                              className="w-full bg-success/90 dark:bg-success-dark/90"
                              style={{ height: `${incomeHeight}%` }}
                            />
                          </>
                        ) : null}
                      </div>
                      <div
                        className={cn(
                          'mt-1 w-full rounded-xl',
                          point.active
                            ? 'bg-warning/80 dark:bg-warning-dark/80'
                            : 'bg-muted dark:bg-muted-dark',
                        )}
                        style={{ height: `${expenseHeight}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{point.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute left-[56%] top-20 hidden rounded-2xl border border-border bg-surface/95 p-3 text-xs shadow-button backdrop-blur dark:border-border-dark dark:bg-surface-dark/95 md:block">
              <p className="text-muted-foreground dark:text-muted-dark-foreground">Wednesday, 7 Jan 2025</p>
              <p className="mt-2 font-semibold text-foreground dark:text-foreground-dark">Savings $240</p>
              <p className="font-semibold text-foreground dark:text-foreground-dark">Income $700</p>
              <p className="font-semibold text-foreground dark:text-foreground-dark">Expenses $460</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 border-t border-border pt-6 dark:border-border-dark xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        {data.summary.map((metric) => {
          const TrendIcon = metric.trend === 'down' ? TrendingDown : TrendingUp;

          return (
            <div key={metric.label}>
              <p className="text-sm text-foreground dark:text-foreground-dark">{metric.label}</p>
              <p className="mt-2 text-3xl font-black tracking-normal text-foreground dark:text-foreground-dark">
                {metric.value}
              </p>
              <p
                className={cn(
                  'mt-2 inline-flex items-center gap-1 text-sm',
                  metric.trend === 'down'
                    ? 'text-warning dark:text-warning-dark'
                    : 'text-success dark:text-success-dark',
                )}
              >
                <TrendIcon className="size-3.5" aria-hidden="true" />
                {metric.trendText}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function FinanceSpendingLimit({ data }: { data: FinanceDashboardData['spendingLimit'] }) {
  const percent = getPercent(data.used, data.limit);

  return (
    <Card className="border-transparent bg-surface p-6 shadow-sm dark:bg-surface-dark">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-normal text-foreground dark:text-foreground-dark">{data.label}</h3>
          <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">{data.helperText}</p>
        </div>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary-hover dark:text-foreground-dark dark:hover:bg-secondary-dark-hover"
          aria-label="Edit spending limit"
        >
          <Pencil className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 h-8 overflow-hidden rounded-lg bg-muted dark:bg-muted-dark">
        <div
          className="h-full rounded-lg bg-success dark:bg-success-dark"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        />
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span className="font-semibold text-foreground dark:text-foreground-dark">{formatFinanceNumber(data.used)}</span>
        <span className="text-muted-foreground dark:text-muted-dark-foreground">{formatFinanceNumber(data.limit)}</span>
      </div>
    </Card>
  );
}

function FinanceBudgetTip({ data }: { data: FinanceDashboardData['budgetTip'] }) {
  return (
    <Card className="relative overflow-hidden border-transparent bg-surface p-6 shadow-sm dark:bg-surface-dark">
      <div className="relative z-10 max-w-xl">
        <h3 className="text-lg font-bold tracking-normal text-foreground dark:text-foreground-dark">{data.title}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-foreground dark:text-foreground-dark">{data.description}</p>
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-primary dark:text-foreground-dark dark:hover:text-primary-dark"
        >
          Read more
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="absolute bottom-5 right-5 grid grid-cols-3 gap-1 opacity-80" aria-hidden="true">
        {['bg-primary-soft', 'bg-warning-soft', 'bg-success-soft', 'bg-secondary', 'bg-warning-soft', 'bg-success-soft', 'bg-success-soft', 'bg-success-soft', 'bg-success-soft'].map((className, index) => (
          <span key={index} className={cn('size-7 rounded-lg dark:bg-secondary-dark', className)} />
        ))}
      </div>
    </Card>
  );
}

function FinanceCostAnalysis({ data }: { data: FinanceDashboardData['costAnalysis'] }) {
  return (
    <Card className="border-transparent bg-surface p-6 shadow-sm dark:bg-surface-dark">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-normal text-foreground dark:text-foreground-dark">Cost analysis</h3>
          <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">Spending overview</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-foreground dark:border-border-dark dark:text-foreground-dark"
        >
          {data.month}
          <ChevronDown className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-7 text-3xl font-black tracking-normal text-foreground dark:text-foreground-dark">{data.total}</p>
      <div className="mt-5 flex h-8 overflow-hidden rounded-lg bg-muted dark:bg-muted-dark">
        {data.categories.map((category) => (
          <span
            key={category.label}
            className={financeProgressStyles[category.tone]}
            style={{ width: `${category.percent}%` }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="mt-6 space-y-2">
        {data.categories.map((category) => (
          <div key={category.label} className="flex items-center justify-between gap-4 text-sm">
            <span className="inline-flex min-w-0 items-center gap-2 text-foreground dark:text-foreground-dark">
              <span className={cn('size-3 rounded-sm', financeProgressStyles[category.tone])} aria-hidden="true" />
              <span className="truncate">{category.label}</span>
            </span>
            <span className="font-semibold text-foreground dark:text-foreground-dark">{category.percent}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function FinanceHealthGauge({ data }: { data: FinanceDashboardData['financialHealth'] }) {
  return (
    <Card className="border-transparent bg-surface p-6 shadow-sm dark:bg-surface-dark">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-normal text-foreground dark:text-foreground-dark">Financial health</h3>
          <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">Current status</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-foreground dark:border-border-dark dark:text-foreground-dark"
        >
          30d
          <ChevronDown className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-7 text-3xl font-black tracking-normal text-foreground dark:text-foreground-dark">{data.total}</p>
      <p className="mt-2 inline-flex items-center gap-1 text-sm text-success dark:text-success-dark">
        <TrendingUp className="size-3.5" aria-hidden="true" />
        {data.trendText}
      </p>
      <div className="relative mx-auto mt-6 h-32 max-w-64">
        <svg viewBox="0 0 180 100" className="h-full w-full" aria-hidden="true">
          <path
            d="M25 85 A65 65 0 0 1 155 85"
            className="stroke-muted dark:stroke-muted-dark"
            fill="none"
            strokeWidth="18"
            strokeLinecap="round"
            pathLength={100}
          />
          <path
            d="M25 85 A65 65 0 0 1 155 85"
            className="stroke-success dark:stroke-success-dark"
            fill="none"
            strokeWidth="18"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${data.score} 100`}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-3xl font-black text-foreground dark:text-foreground-dark">{data.score}%</p>
          <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">Of monthly income saved</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-foreground dark:text-foreground-dark">{data.description}</p>
    </Card>
  );
}

function FinanceGoalTracker({ goals }: { goals: MockFinanceGoal[] }) {
  return (
    <Card className="border-transparent bg-surface p-6 shadow-sm dark:bg-surface-dark">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-normal text-foreground dark:text-foreground-dark">Goal tracker</h3>
          <p className="mt-6 text-sm text-muted-foreground dark:text-muted-dark-foreground">This year</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-foreground dark:border-border-dark dark:text-foreground-dark"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add goals
        </button>
      </div>
      <div className="mt-3 space-y-4">
        {goals.map((goal) => {
          const percent = getPercent(goal.current, goal.target);

          return (
            <div key={goal.id} data-testid="finance-goal-row" className="grid grid-cols-[3rem_minmax(0,1fr)] gap-3">
              <span className={cn('inline-flex size-12 items-center justify-center rounded-xl', financeToneStyles[goal.tone])}>
                <Target className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-foreground dark:text-foreground-dark">{goal.label}</span>
                  <span className="shrink-0 text-xs text-foreground dark:text-foreground-dark">
                    {formatFinanceNumber(goal.current)} / <span className="text-muted-foreground dark:text-muted-dark-foreground">{formatFinanceNumber(goal.target)}</span>
                  </span>
                </div>
                <div className="mt-1 h-4 overflow-hidden rounded-full bg-muted dark:bg-muted-dark">
                  <div className={cn('h-full rounded-full', financeProgressStyles[goal.tone])} style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground dark:text-muted-dark-foreground">{goal.helperText}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function FinanceCardPanel({ data }: { data: FinanceDashboardData }) {
  return (
    <Card className="overflow-hidden border-transparent bg-surface p-6 shadow-sm dark:bg-surface-dark">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-normal text-foreground dark:text-foreground-dark">My card</h3>
          <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">Quick actions</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-foreground dark:border-border-dark dark:text-foreground-dark"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add card
        </button>
      </div>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_5rem] gap-2">
        <div className="min-h-44 rounded-2xl bg-success p-5 text-success-foreground shadow-button dark:bg-success-dark dark:text-success-dark-foreground">
          <div className="flex items-start justify-between text-sm font-semibold">
            <span>Debit card</span>
            <span className="text-lg font-black tracking-normal">VISA</span>
          </div>
          <CreditCard className="mt-9 size-7" aria-hidden="true" />
          <div className="mt-5 flex items-end justify-between gap-3 text-sm">
            <div>
              <p className="font-semibold">**** **** **** 7890</p>
              <p className="mt-1 text-xs">Michael Johnson</p>
            </div>
            <span className="text-xs">03/30</span>
          </div>
        </div>
        <div className="min-h-44 rounded-2xl bg-secondary p-4 text-secondary-foreground dark:bg-secondary-dark dark:text-secondary-dark-foreground">
          <p className="text-xs font-semibold">Credit card</p>
          <CreditCard className="mt-12 size-6 text-muted-foreground dark:text-muted-dark-foreground" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-5 gap-2">
        {financeActions.map((action) => {
          const Icon = action.icon;

          return (
            <button key={action.label} type="button" className="min-w-0 text-center">
              <span className="mx-auto inline-flex size-14 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-secondary-hover dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark dark:hover:bg-secondary-dark-hover">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="mt-2 block truncate text-xs font-semibold text-foreground dark:text-foreground-dark">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between">
        <h4 className="text-sm font-bold text-foreground dark:text-foreground-dark">Quick payment</h4>
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-secondary-hover dark:text-foreground-dark dark:hover:bg-secondary-dark-hover"
          aria-label="More quick payments"
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-2">
        {data.quickPayments.map((contact) => (
          <FinancePaymentContact key={contact.id} contact={contact} />
        ))}
      </div>
    </Card>
  );
}

function FinancePaymentContact({ contact }: { contact: MockFinancePaymentContact }) {
  return (
    <div className="min-w-0 text-center">
      <span className={cn('mx-auto flex size-11 items-center justify-center rounded-xl text-xs font-black', financeToneStyles[contact.tone])}>
        {contact.initials}
      </span>
      <span className="mt-2 block truncate text-xs text-foreground dark:text-foreground-dark">{contact.name}</span>
    </div>
  );
}

function FinanceTransactionHistory({ transactions }: { transactions: MockFinanceTransaction[] }) {
  return (
    <Card className="border-transparent bg-surface p-6 shadow-sm dark:bg-surface-dark">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold tracking-normal text-foreground dark:text-foreground-dark">Transaction history</h3>
          <p className="mt-5 text-xs text-muted-foreground dark:text-muted-dark-foreground">↑↓ Name</p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-foreground dark:border-border-dark dark:text-foreground-dark"
        >
          7d
          <ChevronDown className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} data-testid="finance-transaction-row" className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3">
            <span className={cn('inline-flex size-9 items-center justify-center rounded-xl text-xs font-black', financeToneStyles[transaction.tone])}>
              {transaction.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground dark:text-foreground-dark">{transaction.name}</p>
              <p className="text-xs text-muted-foreground dark:text-muted-dark-foreground">{transaction.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground dark:text-foreground-dark">{transaction.amount}</p>
              <p className={cn('text-xs', financeTextStyles[transaction.tone])}>{transaction.status}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function FinanceDashboardPage({
  className,
  data,
  ...props
}: React.HTMLAttributes<HTMLElement> & { data: FinanceDashboardData }) {
  return (
    <section
      {...props}
      data-testid="dashboard-finance-shell"
      className={cn('min-h-screen bg-secondary p-4 text-foreground dark:bg-background-dark dark:text-foreground-dark', className)}
    >
      <div className="mx-auto grid max-w-[118rem] gap-4 rounded-3xl bg-background p-4 shadow-button dark:bg-background-dark lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_24rem]">
        <FinanceSidebar />

        <main className="min-w-0 space-y-4">
          <FinanceTopbar />
          <FinanceBalanceOverview data={data} />
          <div className="grid gap-4 lg:grid-cols-2">
            <FinanceSpendingLimit data={data.spendingLimit} />
            <FinanceBudgetTip data={data.budgetTip} />
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)]">
            <FinanceCostAnalysis data={data.costAnalysis} />
            <FinanceHealthGauge data={data.financialHealth} />
            <FinanceGoalTracker goals={data.goals} />
          </div>
        </main>

        <aside className="grid gap-4 lg:col-span-2 xl:col-span-1 xl:block xl:space-y-4">
          <FinanceCardPanel data={data} />
          <FinanceTransactionHistory transactions={data.transactions} />
        </aside>
      </div>
    </section>
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
  financeData,
  metrics,
  mock = false,
  pageType = 'data-screen',
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
  const displayFinanceData = React.useMemo(() => {
    // 页面模板需要默认可预览；真实 financeData 传入时始终覆盖中央 mock 数据。
    return financeData ?? mockFinanceDashboardData();
  }, [financeData]);

  if (pageType === 'finance') {
    return <FinanceDashboardPage {...props} className={className} data={displayFinanceData} />;
  }

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
        text="ETLCHINA 内部资产"
        className="z-0 opacity-[0.045] dark:opacity-[0.08]"
      />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-primary/20 bg-surface/70 p-6 shadow-button backdrop-blur dark:border-primary-dark/25 dark:bg-surface-dark/60 lg:flex-row lg:items-center">
          <div className="space-y-4">
            <BrandLogo data-testid="dashboard-brand-logo" variant="full" size="md" />
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary dark:border-primary-dark/30 dark:bg-primary-dark-soft dark:text-primary-dark">
              <LineChart className="size-3.5" aria-hidden="true" />
              ETLCHINA DATA SCREEN
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
