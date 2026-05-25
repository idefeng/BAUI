import * as React from 'react';
import {
  Settings,
  RefreshCw,
  Copy,
  Check,
  MapPin,
  Sliders,
  Braces,
  Play,
  Layers,
  ChevronRight
} from 'lucide-react';

import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Watermark } from '../../ui/watermark';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import {
  DemoContext,
  DemoManifest,
  DemoPageConfig,
  generateThemeColors
} from './demo-context';

// 导入需要演示包装的 Biz 页面与组件
import { StandardLoginPages } from '../login';
import { DashboardTemplate } from '../pages';
import { SmartTable } from '../smart-table';
import { LearningProfile } from '../profile';
import { getRegionPath } from '../../../utils/regions';

// ============================================================================
// 默认演示 Manifest 数据（默认加载四川医学教育场景）
// ============================================================================

export const DEFAULT_DEMO_MANIFEST: DemoManifest = {
  meta: {
    version: '1.0',
    demoName: '四川省医学会医学人才管理演示系统'
  },
  branding: {
    title: '四川省医学继续教育与技能认证平台',
    primaryColor: '#0052D9', // 经典科技蓝
    logo: '',
    watermark: true
  },
  context: {
    ba_training_project: 'SC-MED-2026-AI',
    ba_trainning_title: 'CLINICAL-DOCTOR',
    ba_trainning_type: 'CONTINUING-EDUCATION',
    ba_region_scope: '510000' // 四川省
  },
  flow: [
    { id: 'step-login', type: 'login', style: 'otp' },
    { id: 'step-dash', type: 'dashboard', pageType: 'finance' },
    { id: 'step-users', type: 'table', mockType: 'user' },
    { id: 'step-profile', type: 'profile' }
  ]
};

// ============================================================================
// Provider 包装器实现
// ============================================================================

interface DemoProviderProps {
  children: React.ReactNode;
  initialManifest?: DemoManifest;
}

export function DemoProvider({ children, initialManifest }: DemoProviderProps) {
  const [manifest, setManifest] = React.useState<DemoManifest>(() => {
    // 尝试从 URL 自解压加载 Manifest
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const configParam = params.get('config');
        if (configParam) {
          const decoded = window.atob(decodeURIComponent(configParam));
          const parsed = JSON.parse(decoded);
          if (parsed && parsed.branding && parsed.flow) {
            return parsed as DemoManifest;
          }
        }
      } catch (e) {
        console.warn('URL Manifest 自解压失败，将使用默认配置。', e);
      }
    }
    return initialManifest || DEFAULT_DEMO_MANIFEST;
  });

  const [activePageId, setActivePageId] = React.useState<string>(() => {
    return manifest.flow[0]?.id || 'step-login';
  });

  const updateManifest = React.useCallback(
    (updater: (prev: DemoManifest) => DemoManifest) => {
      setManifest((prev) => {
        const next = updater(prev);
        // 如果更新后旧的 activePageId 不在新的流程中，重置到第一页
        const hasActiveId = next.flow.some((item) => item.id === activePageId);
        if (!hasActiveId && next.flow[0]) {
          setActivePageId(next.flow[0].id);
        }
        return next;
      });
    },
    [activePageId]
  );

  const resetDemo = React.useCallback(() => {
    if (manifest.flow[0]) {
      setActivePageId(manifest.flow[0].id);
    }
  }, [manifest]);

  const value = React.useMemo(
    () => ({
      activePageId,
      manifest,
      setActivePageId,
      updateManifest,
      resetDemo
    }),
    [activePageId, manifest, setActivePageId, updateManifest, resetDemo]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// ============================================================================
// 演示控制浮标组件 (Demo Controller Widget)
// ============================================================================

function DemoControllerWidget() {
  const { activePageId, manifest, setActivePageId, resetDemo } = React.useContext(DemoContext)!;
  const [copied, setCopied] = React.useState(false);
  const [showJson, setShowJson] = React.useState(false);

  const activeIndex = manifest.flow.findIndex((p) => p.id === activePageId);

  // 动态生成一键自解压分享超链接
  const handleCopyLink = () => {
    try {
      const jsonStr = JSON.stringify(manifest);
      const encoded = encodeURIComponent(window.btoa(unescape(encodeURIComponent(jsonStr))));
      const shareUrl = `${window.location.origin}${window.location.pathname}?config=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('链接复制失败', e);
    }
  };

  const pageNames: Record<string, string> = {
    login: '标准安全登录页',
    dashboard: '科技与财务大屏',
    table: '学员明细 SmartTable',
    profile: '学员综合成长档案'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-full bg-primary/95 text-primary-foreground shadow-button backdrop-blur transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-primary-dark/95 dark:text-primary-dark-foreground"
            title="演示控制面板"
          >
            <Settings className="size-5 animate-spin" style={{ animationDuration: '6s' }} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          sideOffset={12}
          className="w-80 border border-border bg-surface/90 p-5 shadow-xl backdrop-blur-md dark:border-border-dark dark:bg-surface-dark/90"
        >
          <div className="space-y-4">
            {/* 头部标题 */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3 dark:border-border-dark/60">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-primary dark:text-primary-dark" />
                <span className="text-sm font-semibold text-foreground dark:text-foreground-dark">演示控制台</span>
              </div>
              <Badge variant="primary" className="text-xs">
                V1.0 Player
              </Badge>
            </div>

            {/* 客群上下文指标 */}
            <div className="rounded-xl bg-secondary/60 p-3 text-xs space-y-2 dark:bg-secondary-dark/60">
              <div className="flex items-center gap-1.5 text-muted-foreground dark:text-muted-dark-foreground">
                <MapPin className="size-3.5" />
                <span>属地化 Mock 绑定:</span>
              </div>
              <div className="font-semibold text-foreground dark:text-foreground-dark">
                {manifest.context.ba_region_scope
                  ? getRegionPath(manifest.context.ba_region_scope).join(' - ')
                  : '全国混合数据'}
              </div>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {manifest.context.ba_training_project && (
                  <Badge variant="gray" className="scale-90 origin-left text-[10px]">
                    项目: {manifest.context.ba_training_project}
                  </Badge>
                )}
                {manifest.context.ba_trainning_title && (
                  <Badge variant="gray" className="scale-90 origin-left text-[10px]">
                    岗位: {manifest.context.ba_trainning_title}
                  </Badge>
                )}
              </div>
            </div>

            {/* 演示流向路由盘点 */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground dark:text-muted-dark-foreground">
                <Layers className="size-3.5" />
                <span>演示链路跳转:</span>
              </div>
              <div className="space-y-1">
                {manifest.flow.map((page, idx) => {
                  const isActive = page.id === activePageId;
                  const isCompleted = idx < activeIndex;
                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setActivePageId(page.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold dark:bg-primary-dark/20 dark:text-primary-dark'
                          : isCompleted
                          ? 'text-muted-foreground line-through hover:bg-secondary dark:hover:bg-secondary-dark'
                          : 'text-foreground hover:bg-secondary dark:text-foreground-dark dark:hover:bg-secondary-dark'
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] opacity-60">0{idx + 1}.</span>
                        {pageNames[page.type] || page.id}
                      </span>
                      {isActive && <ChevronRight className="size-3.5 animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 操作面板 */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 dark:border-border-dark/60">
              <Button variant="outline" size="sm" className="h-9 text-xs" onClick={resetDemo}>
                <RefreshCw className="mr-1.5 size-3.5" />
                重置流程
              </Button>
              <Button variant="solid" size="sm" className="h-9 text-xs" onClick={handleCopyLink}>
                {copied ? <Check className="mr-1.5 size-3.5" /> : <Copy className="mr-1.5 size-3.5" />}
                {copied ? '已复制' : '复制超链接'}
              </Button>
            </div>

            {/* 高科技 Schema 查看 */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground focus:outline-none dark:hover:text-foreground-dark"
              >
                <Braces className="size-3" />
                <span>{showJson ? '隐藏 JSON 协议' : '查看 JSON 协议'}</span>
              </button>
              {showJson && (
                <pre className="max-h-36 overflow-y-auto rounded-lg bg-secondary/80 p-2 font-mono text-[9px] text-foreground dark:bg-secondary-dark/80 dark:text-foreground-dark">
                  {JSON.stringify(manifest, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ============================================================================
// 零代码播放器核心组件 (Demo Player Core)
// ============================================================================

export function DemoPlayer() {
  const { activePageId, manifest, setActivePageId } = React.useContext(DemoContext)!;

  // 获取当前正在展示的页面配置
  const activePageConfig = manifest.flow.find((page) => page.id === activePageId);

  // 准备分发给子组件的企业上下文参数
  const contextData = React.useMemo(
    () => ({
      ba_training_project: manifest.context.ba_training_project,
      ba_trainning_title: manifest.context.ba_trainning_title,
      ba_trainning_type: manifest.context.ba_trainning_type,
      ba_region_scope: manifest.context.ba_region_scope
    }),
    [manifest.context]
  );

  // 处理无代码自动流程跳转
  const handleNextTransition = (currentId: string) => {
    const currentIdx = manifest.flow.findIndex((p) => p.id === currentId);
    if (currentIdx !== -1 && currentIdx < manifest.flow.length - 1) {
      const nextId = manifest.flow[currentIdx + 1].id;
      setActivePageId(nextId);
    }
  };

  // 根据颜色动态推导色彩方案并注入行内 style 容器
  const themeStyles = React.useMemo(
    () => generateThemeColors(manifest.branding.primaryColor),
    [manifest.branding.primaryColor]
  );

  if (!activePageConfig) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
        <p className="text-sm font-medium">演示流程配置异常，未能匹配激活页面。</p>
        <Button onClick={() => setActivePageId(manifest.flow[0]?.id)}>重置回第一步</Button>
      </div>
    );
  }

  // 渲染视图，并根据配置注入水印
  const renderPageView = () => {
    switch (activePageConfig.type) {
      case 'login':
        return (
          <StandardLoginPages
            type={(activePageConfig.style as any) || 'tech'}
            mock
            onSubmit={() => handleNextTransition(activePageConfig.id)}
          />
        );
      case 'dashboard':
        return (
          <DashboardTemplate
            mock
            pageType={(activePageConfig.pageType as any) || 'finance'}
            {...contextData}
          />
        );
      case 'table':
        return (
          <div className="min-h-screen bg-background p-8 dark:bg-background-dark">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between border-b border-border/40 pb-4 dark:border-border-dark/40 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                  {manifest.branding.title || '从业人员数据管理中心'}
                </h1>
                <p className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-1">
                  数据基于客群和属地上下文动态清洗仿真，保证零泄露安全演示。
                </p>
              </div>
              <Button
                variant="solid"
                size="sm"
                className="w-full md:w-auto"
                onClick={() => handleNextTransition(activePageConfig.id)}
              >
                进入下一步学员档案
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
            <SmartTable
              mock
              mockType={(activePageConfig.mockType as any) || 'user'}
              {...contextData}
            />
          </div>
        );
      case 'profile':
        return (
          <div className="min-h-screen bg-background p-8 dark:bg-background-dark">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between border-b border-border/40 pb-4 dark:border-border-dark/40 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                  核心学员画像与成长档案
                </h1>
                <p className="text-xs text-muted-foreground dark:text-muted-dark-foreground mt-1">
                  模拟特定学员在对应继续教育培训项目下的证书和学习课程轨迹。
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full md:w-auto"
                onClick={() => {
                  if (manifest.flow[0]) setActivePageId(manifest.flow[0].id);
                }}
              >
                <RefreshCw className="mr-1.5 size-3.5" />
                重新测试演示
              </Button>
            </div>
            <Card className="max-w-6xl mx-auto p-2 bg-surface/50 dark:bg-surface-dark/50 backdrop-blur-sm shadow-xl">
              <LearningProfile
                studentId="student-it-001"
                mock
                {...contextData}
              />
            </Card>
          </div>
        );
      default:
        return <div>未知的页面节点类型</div>;
    }
  };

  return (
    <div style={themeStyles} className="relative select-none" data-testid="demo-player-container">
      {manifest.branding.watermark ? (
        <Watermark content={manifest.branding.title} opacity={0.06}>
          {renderPageView()}
          <DemoControllerWidget />
        </Watermark>
      ) : (
        <>
          {renderPageView()}
          <DemoControllerWidget />
        </>
      )}
    </div>
  );
}
