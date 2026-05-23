import * as React from 'react';
import {
  BadgeCheck,
  BookOpenCheck,
  BrainCircuit,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  MonitorCheck,
  Rocket,
  Sparkles,
  UsersRound,
} from 'lucide-react';

import { cn } from '../../../lib/utils';
import { getRegionPath } from '../../../utils/regions';
import { BrandBackground, BrandLogo } from '../../ui/branding';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Cascader } from '../../ui/cascader';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { uiStyles } from '../../ui/shared/styles';
import { Statistic } from '../../ui/statistic';
import { CertificateTemplate } from '../certificate';
import { NavMenu, type NavMenuItem } from '../navigation';
import { CardGridPage, DashboardTemplate } from '../pages';
import { LearningProfile } from '../profile';

export const ETLCHINA_TRAINNING_TITLE_OPTIONS = [
  {
    value: 'AI-AGENT-ENGINEER',
    label: 'AI工程师',
    project: 'ETLCHINA-2026-AI',
    jobLabel: 'AI Agent 工程师',
    courseSignal: 'Python / LLM / Agent',
  },
  {
    value: 'FULLSTACK-DEVELOPER',
    label: '全栈开发',
    project: 'ETLCHINA-2026-FRONTEND',
    jobLabel: '全栈开发工程师',
    courseSignal: 'React / Node.js / 云原生',
  },
] as const;

export const ETLCHINA_USER_ROLE_WHITELIST = ['学员', '讲师'] as const;

export type EtlChinaTrainningTitle = (typeof ETLCHINA_TRAINNING_TITLE_OPTIONS)[number]['value'];
export type EtlChinaUserRole = (typeof ETLCHINA_USER_ROLE_WHITELIST)[number];

export interface EtlChinaRegistryHeroProps extends React.HTMLAttributes<HTMLElement> {
  /** 默认行政区划完整路径，按 Cascader 的 value path 传入。 */
  defaultRegionValue?: string[];
  /** 默认培训岗位，值来自 ETLCHINA 首屏内置白名单。 */
  defaultTrainningTitle?: EtlChinaTrainningTitle;
  /** 默认操作角色，值来自 ETLCHINA_USER_ROLE_WHITELIST。 */
  defaultUserRole?: EtlChinaUserRole;
  /** 是否进入页面时直接展开 Mock 演练区，适合 Storybook 固定状态截图。 */
  defaultActivated?: boolean;
}

interface EtlChinaScenario {
  regionValue: string[];
  regionScope?: string;
  regionName: string;
  trainningTitle: EtlChinaTrainningTitle;
  titleLabel: string;
  jobLabel: string;
  project: string;
  courseSignal: string;
  userRole: EtlChinaUserRole;
}

const defaultRegionValue = ['440000', '440100', '440106'];
const trainningType = 'CONTINUING-EDUCATION';

const heroStatistics = [
  { title: '组件完备度', value: '96', suffix: '%', trendText: 'Ant 覆盖推进中' },
  { title: 'Mock 覆盖率', value: '100', suffix: '%', trendText: '中央造数兜底' },
  { title: '模板可用度', value: '2', suffix: 'min', trendText: '盲推整页' },
] as const;

const roleControlIds = {
  学员: 'etlchina-role-learner',
  讲师: 'etlchina-role-teacher',
} satisfies Record<EtlChinaUserRole, string>;

const isTrainningTitle = (value: string): value is EtlChinaTrainningTitle =>
  ETLCHINA_TRAINNING_TITLE_OPTIONS.some((option) => option.value === value);

const isUserRole = (value: string): value is EtlChinaUserRole =>
  ETLCHINA_USER_ROLE_WHITELIST.includes(value as EtlChinaUserRole);

const getTrainningOption = (value: EtlChinaTrainningTitle) =>
  ETLCHINA_TRAINNING_TITLE_OPTIONS.find((option) => option.value === value) ?? ETLCHINA_TRAINNING_TITLE_OPTIONS[0];

const getRegionDisplay = (regionValue: string[]) => {
  const selectedScope = regionValue.at(-1);
  const regionPath = selectedScope ? getRegionPath(selectedScope) : [];

  return {
    regionName: regionPath[0] ?? '全国',
    regionScope: selectedScope,
  };
};

const getScenarioKey = (scenario: EtlChinaScenario) =>
  [scenario.regionScope ?? 'national', scenario.trainningTitle, scenario.userRole].join(':');

const createNavItems = (scenario: EtlChinaScenario): NavMenuItem[] => {
  if (scenario.userRole === '讲师') {
    return [
      { key: 'teacher-home', label: '讲师首页', icon: 'LayoutDashboard', path: '/teacher' },
      { key: 'teacher-courses', label: '开课中心', icon: 'BookOpen', path: '/teacher/courses' },
      { key: 'teacher-grading', label: '批改任务', icon: 'ListChecks', path: '/teacher/grading' },
      { key: 'teacher-learners', label: `${scenario.regionName}学员`, icon: 'Users', path: '/teacher/learners' },
      { key: 'teacher-certs', label: '证书复核', icon: 'Award', path: '/teacher/certificates' },
    ];
  }

  return [
    { key: 'learner-home', label: '学习首页', icon: 'Home', path: '/learner' },
    { key: 'learner-courses', label: `${scenario.titleLabel}课程`, icon: 'BookOpen', path: '/learner/courses' },
    { key: 'learner-tasks', label: '修读任务', icon: 'ListChecks', path: '/learner/tasks' },
    { key: 'learner-certs', label: '培训证书', icon: 'Award', path: '/learner/certificates' },
    { key: 'learner-profile', label: '个人档案', icon: 'Users', path: '/learner/profile' },
  ];
};

const createBusinessProps = (scenario: EtlChinaScenario) => ({
  ba_training_project: scenario.project,
  ba_trainning_title: scenario.trainningTitle,
  ba_trainning_type: trainningType,
  ba_region_scope: scenario.regionScope,
});

const RoleOption = ({
  option,
}: {
  option: EtlChinaUserRole;
}) => (
  <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/70 px-3 py-2 dark:border-border-dark dark:bg-surface-dark/70">
    <RadioGroupItem id={roleControlIds[option]} value={option} aria-label={option} />
    <label
      htmlFor={roleControlIds[option]}
      className="cursor-pointer text-sm font-semibold text-foreground dark:text-foreground-dark"
    >
      {option}
    </label>
  </div>
);

const ControlLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">{children}</span>
);

function TeacherOperationsPanel({ scenario }: { scenario: EtlChinaScenario }) {
  const businessProps = createBusinessProps(scenario);
  const cards = [
    { label: '待批改作业', value: 36, suffix: '份', icon: <ClipboardCheck /> },
    { label: '开课数据', value: 12, suffix: '班', icon: <MonitorCheck /> },
    { label: '学员互动', value: 428, suffix: '次', icon: <UsersRound /> },
  ];

  return (
    <div className="mt-6 grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card
            key={card.label}
            className="relative overflow-hidden border-primary/20 bg-surface/85 p-5 shadow-button backdrop-blur dark:border-primary-dark/25 dark:bg-surface-dark/75"
          >
            <div className="absolute right-4 top-4 size-20 rounded-full bg-primary-soft blur-2xl dark:bg-primary-dark-soft" aria-hidden="true" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground dark:text-muted-dark-foreground">{card.label}</p>
                <p className="mt-3 text-3xl font-black text-foreground dark:text-foreground-dark">
                  {card.value}
                  <span className="ml-1 text-sm font-semibold text-muted-foreground dark:text-muted-dark-foreground">
                    {card.suffix}
                  </span>
                </p>
              </div>
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark [&>svg]:size-5">
                {card.icon}
              </span>
            </div>
          </Card>
        ))}
      </div>
      <CardGridPage
        mock
        {...businessProps}
        title={`${scenario.regionName}${scenario.titleLabel}开课项目库`}
        description="讲师视角下的开课、批改、学员进度与证书复核全部由中央 Mock 引擎生成。"
        className="min-h-[38rem] rounded-3xl bg-secondary/80 p-4 dark:bg-background-dark/70"
      />
    </div>
  );
}

function LearnerOperationsPanel({ scenario }: { scenario: EtlChinaScenario }) {
  const businessProps = createBusinessProps(scenario);

  return (
    <div className="mt-6 grid gap-6">
      <LearningProfile
        mock
        {...businessProps}
        studentId={`${scenario.regionScope ?? 'national'}-${scenario.trainningTitle.toLowerCase()}`}
      />
      <Card className="overflow-hidden p-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground dark:text-foreground-dark">培训证书即时生成</h3>
            <p className="mt-1 text-sm text-muted-foreground dark:text-muted-dark-foreground">
              证书模板直接消费同一组属地、岗位和培训类型业务属性。
            </p>
          </div>
          <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success dark:bg-success-dark-soft dark:text-success-dark">
            已接入 CertificateTemplate
          </span>
        </div>
        <CertificateTemplate mock {...businessProps} type="education" showActions={false} />
      </Card>
    </div>
  );
}

function EtlChinaRegistryPreview({
  scenario,
  syncing,
}: {
  scenario: EtlChinaScenario;
  syncing: boolean;
}) {
  const businessProps = createBusinessProps(scenario);
  const title = `${scenario.regionName} ${scenario.titleLabel}${scenario.userRole}后台`;
  const description =
    scenario.userRole === '讲师'
      ? `${scenario.regionName}${scenario.jobLabel}讲师视角：开课数据、批改任务和证书复核随业务属性实时切换。`
      : `${scenario.regionName}${scenario.jobLabel}学员视角：学习看板、课程修读、培训证书和导航菜单统一联动。`;
  const navItems = createNavItems(scenario);

  return (
    <section
      data-testid="etlchina-registry-preview"
      className={cn(
        'relative mt-8 overflow-hidden rounded-3xl border border-primary/20 bg-background/80 p-4 shadow-button backdrop-blur-xl transition-all duration-500 dark:border-primary-dark/25 dark:bg-background-dark/80 sm:p-5',
        syncing ? 'scale-[0.995] opacity-90' : 'scale-100 opacity-100',
      )}
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid text-primary/10 dark:text-primary-dark/10" aria-hidden="true" />
      <div className="relative z-10">
        <header className="mb-5 flex flex-col gap-4 rounded-3xl border border-border bg-surface/80 p-5 backdrop-blur dark:border-border-dark dark:bg-surface-dark/75 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary dark:bg-primary-dark-soft dark:text-primary-dark">
              <Sparkles className="size-3.5" aria-hidden="true" />
              mock=true
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-normal text-foreground dark:text-foreground-dark">
              {title}
            </h2>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
              {description}
            </p>
          </div>
          <div className="grid gap-2 rounded-3xl border border-border bg-background/70 p-4 text-sm dark:border-border-dark dark:bg-background-dark/60">
            <span className="font-semibold text-foreground dark:text-foreground-dark">{scenario.courseSignal}</span>
            <span className="text-muted-foreground dark:text-muted-dark-foreground">
              {scenario.regionName} · {scenario.userRole} · 1 秒平滑切换
            </span>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="grid h-fit gap-4 rounded-3xl border border-border bg-surface/80 p-4 shadow-button backdrop-blur dark:border-border-dark dark:bg-surface-dark/75">
            <div>
              <h3 className="text-base font-bold text-foreground dark:text-foreground-dark">
                {scenario.userRole}导航菜单
              </h3>
              <p className="mt-1 text-sm text-muted-foreground dark:text-muted-dark-foreground">
                角色切换后菜单语义同步变化。
              </p>
            </div>
            <NavMenu items={navItems} currentPath={scenario.userRole === '讲师' ? '/teacher/grading' : '/learner/courses'} />
          </aside>

          <main className="min-w-0">
            <DashboardTemplate
              mock
              {...businessProps}
              title={title}
              description={description}
              trendTitle={`${scenario.regionName}${scenario.titleLabel}${scenario.userRole}趋势`}
              className="min-h-[36rem] rounded-3xl p-4 dark:bg-background-dark/80 sm:p-5"
            />
            {scenario.userRole === '讲师' ? (
              <TeacherOperationsPanel scenario={scenario} />
            ) : (
              <LearnerOperationsPanel scenario={scenario} />
            )}
          </main>
        </div>
      </div>
    </section>
  );
}

/** EtlChinaRegistryHero 是 Storybook 官方首屏，用一套业务控制台串起品牌、页面模板和全库 Mock 能力。 */
export function EtlChinaRegistryHero({
  className,
  defaultActivated = false,
  defaultRegionValue: defaultRegionValueProp = defaultRegionValue,
  defaultTrainningTitle = 'AI-AGENT-ENGINEER',
  defaultUserRole = '学员',
  ...props
}: EtlChinaRegistryHeroProps) {
  const safeDefaultTitle = isTrainningTitle(defaultTrainningTitle) ? defaultTrainningTitle : 'AI-AGENT-ENGINEER';
  const safeDefaultRole = isUserRole(defaultUserRole) ? defaultUserRole : '学员';
  const [regionValue, setRegionValue] = React.useState<string[]>(defaultRegionValueProp);
  const [trainningTitle, setTrainningTitle] = React.useState<EtlChinaTrainningTitle>(safeDefaultTitle);
  const [userRole, setUserRole] = React.useState<EtlChinaUserRole>(safeDefaultRole);
  const [activated, setActivated] = React.useState(defaultActivated);
  const [syncing, setSyncing] = React.useState(false);
  const trainningOption = getTrainningOption(trainningTitle);
  const regionDisplay = getRegionDisplay(regionValue);
  const scenario = React.useMemo<EtlChinaScenario>(
    () => ({
      regionValue,
      regionScope: regionDisplay.regionScope,
      regionName: regionDisplay.regionName,
      trainningTitle,
      titleLabel: trainningOption.label,
      jobLabel: trainningOption.jobLabel,
      project: trainningOption.project,
      courseSignal: trainningOption.courseSignal,
      userRole,
    }),
    [regionDisplay.regionName, regionDisplay.regionScope, regionValue, trainningOption, trainningTitle, userRole],
  );
  const scenarioKey = getScenarioKey(scenario);

  React.useEffect(() => {
    if (!activated) {
      return;
    }

    // 已激活后任意业务属性变化都触发短暂同步态，模拟接口重算和页面平滑切换。
    setSyncing(true);
    const timer = window.setTimeout(() => setSyncing(false), 700);

    return () => window.clearTimeout(timer);
  }, [activated, scenarioKey]);

  const handleTrainningTitleChange = (nextValue: string) => {
    if (isTrainningTitle(nextValue)) {
      setTrainningTitle(nextValue);
    }
  };

  const handleUserRoleChange = (nextValue: string) => {
    if (isUserRole(nextValue)) {
      setUserRole(nextValue);
    }
  };

  return (
    <section
      {...props}
      className={cn(
        'relative min-h-screen overflow-hidden bg-background px-4 py-6 text-foreground dark:bg-background-dark dark:text-foreground-dark sm:px-6 lg:px-8',
        className,
      )}
    >
      <BrandBackground />
      <div className="pointer-events-none absolute inset-0 bg-grid text-primary/10 dark:text-primary-dark/10" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/90 to-transparent dark:from-background-dark/90" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid min-h-[calc(100vh-3rem)] gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:items-center">
          <div className="grid gap-7">
            <BrandLogo variant="full" size="lg" />
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-surface/70 px-3 py-1.5 text-xs font-bold text-primary shadow-button backdrop-blur dark:border-primary-dark/30 dark:bg-surface-dark/60 dark:text-primary-dark">
                <Rocket className="size-3.5" aria-hidden="true" />
                ETLCHINA REGISTRY OFFICIAL HERO
              </div>
              <h1 className="max-w-5xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-4xl font-black leading-tight tracking-normal text-transparent animate-pulse sm:text-5xl lg:text-6xl">
                博奥教育企业级前端业务中台 - ETLCHINA
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground dark:text-muted-dark-foreground sm:text-lg">
                一次选择属地、岗位和角色，立刻把页面模板、导航、学习档案、证书和运营指标全部接入中央 Mock 引擎。
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {heroStatistics.map((statistic, index) => (
                <Statistic
                  key={statistic.title}
                  title={statistic.title}
                  value={statistic.value}
                  suffix={statistic.suffix}
                  trend="up"
                  trendText={statistic.trendText}
                  className={cn(
                    'border-primary/20 bg-surface/75 shadow-button backdrop-blur dark:border-primary-dark/25 dark:bg-surface-dark/65',
                    index === 1 && 'border-success/20 dark:border-success-dark/25',
                  )}
                />
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden border-primary/20 bg-white/20 p-5 shadow-xl backdrop-blur-md dark:border-primary-dark/25 dark:bg-slate-900/40 sm:p-6">
            <div className="absolute -right-12 -top-12 size-40 rounded-full bg-primary-soft/70 blur-3xl dark:bg-primary-dark-soft/50" aria-hidden="true" />
            <div className="absolute -bottom-14 left-8 size-36 rounded-full bg-success-soft/70 blur-3xl dark:bg-success-dark-soft/40" aria-hidden="true" />
            <div className="relative grid gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary dark:bg-primary-dark-soft dark:text-primary-dark">
                  <BrainCircuit className="size-3.5" aria-hidden="true" />
                  业务属性配置面板
                </div>
                <h2 className="mt-4 text-2xl font-black tracking-normal text-foreground dark:text-foreground-dark">
                  生产力控制台
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
                  控制台只选择三项，底部完整页面会自动吃透 mock、属地、岗位和角色上下文。
                </p>
              </div>

              <div className="grid gap-4">
                <label className="grid gap-2">
                  <ControlLabel>行政区划</ControlLabel>
                  <Cascader
                    type="region"
                    ba_region_level="DISTRICT"
                    value={regionValue}
                    placeholder="选择行政区划"
                    onChange={(nextValue) => setRegionValue(nextValue)}
                  />
                </label>

                <label className="grid gap-2">
                  <ControlLabel>培训岗位</ControlLabel>
                  <Select value={trainningTitle} onValueChange={handleTrainningTitleChange}>
                    <SelectTrigger aria-label="培训岗位">
                      <SelectValue placeholder="选择培训岗位" />
                    </SelectTrigger>
                    <SelectContent>
                      {ETLCHINA_TRAINNING_TITLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>

                <div className="grid gap-2">
                  <ControlLabel>操作角色</ControlLabel>
                  <RadioGroup
                    value={userRole}
                    onValueChange={handleUserRoleChange}
                    className="grid-cols-2 gap-3"
                    aria-label="操作角色"
                  >
                    {ETLCHINA_USER_ROLE_WHITELIST.map((option) => (
                      <RoleOption key={option} option={option} />
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-surface/70 p-4 text-sm dark:border-border-dark dark:bg-surface-dark/65">
                <div className="flex items-center gap-2 font-semibold text-foreground dark:text-foreground-dark">
                  <BadgeCheck className="size-4 text-success dark:text-success-dark" aria-hidden="true" />
                  当前演练链路
                </div>
                <p className="mt-2 leading-6 text-muted-foreground dark:text-muted-dark-foreground">
                  {scenario.regionName} · {scenario.titleLabel} · {scenario.userRole} · {scenario.courseSignal}
                </p>
              </div>

              <Button
                size="lg"
                fullWidth
                className={cn(
                  'h-14 rounded-3xl text-base shadow-xl transition-transform duration-300 hover:-translate-y-0.5',
                  uiStyles.focusBreathingRing,
                )}
                leftIcon={<Sparkles />}
                onClick={() => setActivated(true)}
              >
                一键激活业务中台 Mock 演练
              </Button>
            </div>
          </Card>
        </div>

        {activated ? <EtlChinaRegistryPreview scenario={scenario} syncing={syncing} /> : null}

        <div className="relative mt-6 grid gap-3 rounded-3xl border border-border bg-surface/70 p-4 text-sm text-muted-foreground shadow-button backdrop-blur dark:border-border-dark dark:bg-surface-dark/60 dark:text-muted-dark-foreground sm:grid-cols-3">
          <div className="inline-flex items-center gap-2">
            <LayoutDashboard className="size-4 text-primary dark:text-primary-dark" aria-hidden="true" />
            DashboardTemplate
          </div>
          <div className="inline-flex items-center gap-2">
            <BookOpenCheck className="size-4 text-success dark:text-success-dark" aria-hidden="true" />
            LearningProfile / CardGridPage
          </div>
          <div className="inline-flex items-center gap-2">
            <GraduationCap className="size-4 text-primary dark:text-primary-dark" aria-hidden="true" />
            CertificateTemplate
          </div>
        </div>
      </div>
    </section>
  );
}

EtlChinaRegistryHero.displayName = 'EtlChinaRegistryHero';
