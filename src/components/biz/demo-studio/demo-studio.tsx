import * as React from 'react';
import {
  Sliders,
  Sparkles,
  MapPin,
  Palette,
  Layers,
  Share2,
  Check,
  Building,
  Eye,
  CheckCircle2
} from 'lucide-react';

import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Cascader } from '../../ui/cascader';
import { Switch } from '../../ui/switch';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import {
  DemoContext,
  DemoManifest
} from './demo-context';
import {
  DemoProvider,
  DemoPlayer,
  DEFAULT_DEMO_MANIFEST
} from './demo-player';
import { getRegionValuePath } from '../../../utils/regions';

// ============================================================================
// 常量定义：预设主题主色调 & 业务属性白名单
// ============================================================================

const PRESET_THEMES = [
  { name: '经典科技蓝', hex: '#0052D9' },
  { name: '活力极客绿', hex: '#26B899' },
  { name: '尊贵皇家紫', hex: '#4F46E5' },
  { name: '安全预警橙', hex: '#D97706' },
  { name: '科技应急红', hex: '#F04438' }
];

const PRESET_PROJECTS = [
  { code: 'SC-CONSTRUCTION-2026-SAFETY', name: '四川住房和城乡建设厅安全员项目' },
  { code: 'GD-FOOD-ADMIN-HEALTH-2026', name: '广东省食品安全管理员继续教育项目' },
  { code: 'SC-MED-2026-AI', name: '四川省急重症继续医学教育AI升级项目' },
  { code: 'SLEEP-TECH-TRAINING', name: '睡眠技师与健康管理专项能力提升项目' },
  { code: 'EMERGENCY-RESCUER', name: '国家应急救援员岗位技能提升项目' }
];

const PRESET_TITLES = [
  { code: 'CLINICAL-DOCTOR', name: '临床继续教育医师' },
  { code: 'SAFETY-OFFICER', name: '住房和建设施工安全员' },
  { code: 'NUTRITIONIST', name: '公共营养师/健康管理师' },
  { code: 'EMERGENCY-RESCUER', name: '国家级应急救援员' },
  { code: 'SLEEP-TECH-TRAINING', name: '睡眠监测与管理技师' }
];

const PRESET_TYPES = [
  { code: 'CONTINUING-EDUCATION', name: '继续教育 (Continuing Education)' },
  { code: 'VOCATIONAL-TRAINING', name: '职业培训 (Vocational Training)' },
  { code: 'SPECIAL-UPGRADE', name: '专项能力提升 (Special Upgrade)' }
];

// ============================================================================
// 装配控制面板 (Studio Control Panel)
// ============================================================================

function StudioControlPanel() {
  const { manifest, updateManifest } = React.useContext(DemoContext)!;
  const [shareCopied, setShareCopied] = React.useState(false);

  // 一键复制分享超链接
  const handleShare = () => {
    try {
      const jsonStr = JSON.stringify(manifest);
      const encoded = encodeURIComponent(window.btoa(unescape(encodeURIComponent(jsonStr))));
      const shareUrl = `${window.location.origin}${window.location.pathname}?config=${encoded}`;
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (e) {
      console.error('分享链接生成失败', e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark overflow-y-auto">
      {/* 头部标题区 */}
      <div className="p-6 border-b border-border dark:border-border-dark flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark shadow-sm">
            <Sliders className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground dark:text-foreground-dark">演示装配控制台</h1>
            <p className="text-xs text-muted-foreground dark:text-muted-dark-foreground">任何人均可快速装配</p>
          </div>
        </div>
        <Badge variant="primary" className="flex items-center gap-1 py-1">
          <Sparkles className="size-3" />
          低代码
        </Badge>
      </div>

      {/* 表单配置内容区 */}
      <div className="flex-1 p-6 space-y-6">
        {/* 1. 客户定制品牌 */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Building className="size-4 text-primary dark:text-primary-dark" />
            1. 品牌专属定制
          </h2>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground mb-1.5">
                演示系统名称
              </label>
              <Input
                type="text"
                placeholder="请输入面向客户的演示系统标题"
                value={manifest.branding.title}
                onChange={(e) =>
                  updateManifest((prev: DemoManifest) => ({
                    ...prev,
                    branding: { ...prev.branding, title: e.target.value }
                  }))
                }
              />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/40 dark:border-border-dark/40">
              <div>
                <span className="text-xs font-semibold text-foreground dark:text-foreground-dark block">
                  全局安全水印
                </span>
                <span className="text-[10px] text-muted-foreground dark:text-muted-dark-foreground">
                  全页面背景注入客户专属防伪水印
                </span>
              </div>
              <Switch
                checked={manifest.branding.watermark}
                onCheckedChange={(checked) =>
                  updateManifest((prev: DemoManifest) => ({
                    ...prev,
                    branding: { ...prev.branding, watermark: checked }
                  }))
                }
              />
            </div>
          </div>
        </section>

        {/* 2. 主题配色选取 */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Palette className="size-4 text-primary dark:text-primary-dark" />
            2. 品牌主色调
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                type="color"
                className="size-10 p-0 border-0 rounded-lg cursor-pointer shrink-0"
                value={manifest.branding.primaryColor}
                onChange={(e) =>
                  updateManifest((prev: DemoManifest) => ({
                    ...prev,
                    branding: { ...prev.branding, primaryColor: e.target.value }
                  }))
                }
              />
              <Input
                type="text"
                maxLength={7}
                placeholder="十六进制颜色"
                value={manifest.branding.primaryColor}
                onChange={(e) =>
                  updateManifest((prev: DemoManifest) => ({
                    ...prev,
                    branding: { ...prev.branding, primaryColor: e.target.value }
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {PRESET_THEMES.map((theme) => {
                const isSelected = manifest.branding.primaryColor.toUpperCase() === theme.hex.toUpperCase();
                return (
                  <button
                    key={theme.hex}
                    type="button"
                    onClick={() =>
                      updateManifest((prev: DemoManifest) => ({
                        ...prev,
                        branding: { ...prev.branding, primaryColor: theme.hex }
                      }))
                    }
                    className={cn(
                      'group relative h-8 rounded-lg flex items-center justify-center border transition-all hover:scale-102',
                      isSelected ? 'border-primary ring-2 ring-primary/20 dark:border-primary-dark' : 'border-border dark:border-border-dark'
                    )}
                    style={{ backgroundColor: theme.hex }}
                    title={theme.name}
                  >
                    {isSelected && <Check className="size-3.5 text-white drop-shadow-sm" />}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. 属地化 Mock 驱动配置 */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
            <MapPin className="size-4 text-primary dark:text-primary-dark" />
            3. 属地与业务数据仿真
          </h2>
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground mb-1.5">
                全国行政区划定位
              </label>
              <Cascader
                type="region"
                ba_region_level="CITY"
                placeholder="请选择目标客户所属省市"
                value={manifest.context.ba_region_scope ? getRegionValuePath(manifest.context.ba_region_scope) : []}
                onChange={(path) => {
                  const adcode = path[path.length - 1];
                  updateManifest((prev: DemoManifest) => ({
                    ...prev,
                    context: { ...prev.context, ba_region_scope: adcode }
                  }));
                }}
              />
              <span className="text-[10px] text-muted-foreground dark:text-muted-dark-foreground mt-1 block">
                说明：Mock 引擎将自动依据省市 Adcode 重组人员身份证、手机号、行政区名称及课程。
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground mb-1.5">
                绑定培训项目 (Project)
              </label>
              <select
                value={manifest.context.ba_training_project || ''}
                onChange={(e) =>
                  updateManifest((prev: DemoManifest) => ({
                    ...prev,
                    context: { ...prev.context, ba_training_project: e.target.value || undefined }
                  }))
                }
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-xs text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark"
              >
                <option value="">-- 全国综合型默认项目 --</option>
                {PRESET_PROJECTS.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground mb-1.5">
                绑定培训岗位 (Title)
              </label>
              <select
                value={manifest.context.ba_trainning_title || ''}
                onChange={(e) =>
                  updateManifest((prev: DemoManifest) => ({
                    ...prev,
                    context: { ...prev.context, ba_trainning_title: e.target.value || undefined }
                  }))
                }
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-xs text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark"
              >
                <option value="">-- 通用混合型岗位 --</option>
                {PRESET_TITLES.map((t) => (
                  <option key={t.code} value={t.code}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground dark:text-muted-dark-foreground mb-1.5">
                绑定培训类型 (Type)
              </label>
              <select
                value={manifest.context.ba_trainning_type || ''}
                onChange={(e) =>
                  updateManifest((prev: DemoManifest) => ({
                    ...prev,
                    context: { ...prev.context, ba_trainning_type: e.target.value || undefined }
                  }))
                }
                className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-xs text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark"
              >
                <option value="">-- 全品类混合 --</option>
                {PRESET_TYPES.map((ty) => (
                  <option key={ty.code} value={ty.code}>
                    {ty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 4. 演示路由流编排 */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground dark:text-foreground-dark flex items-center gap-2">
            <Layers className="size-4 text-primary dark:text-primary-dark" />
            4. 演示链路流 (Page Flow)
          </h2>
          <div className="rounded-xl border border-border bg-secondary/35 p-3 space-y-3 dark:border-border-dark dark:bg-secondary-dark/35">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4.5 text-primary dark:text-primary-dark mt-0.5 shrink-0" />
              <div>
                <span className="text-xs font-bold text-foreground dark:text-foreground-dark block">极简 4 级串联路由流</span>
                <span className="text-[10px] text-muted-foreground dark:text-muted-dark-foreground">
                  免去复杂配置，系统全自动进行流程递进逻辑绑定：
                </span>
                <div className="mt-2 text-[10px] text-foreground dark:text-foreground-dark bg-surface/60 dark:bg-surface-dark/60 rounded p-2 border border-border/40 font-mono space-y-1">
                  <div>1. 免密登录页 (OTP Login)</div>
                  <div>2. 财务控制台 (Dashboard)</div>
                  <div>3. 从业人员数据 (SmartTable)</div>
                  <div>4. 学员画像轨迹 (LearningProfile)</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 底部一键分享区 */}
      <div className="p-6 border-t border-border dark:border-border-dark bg-secondary/20 dark:bg-secondary-dark/10">
        <Button variant="solid" className="w-full flex items-center justify-center gap-2" onClick={handleShare}>
          {shareCopied ? <Check className="size-4" /> : <Share2 className="size-4" />}
          {shareCopied ? '演示链接已复制！' : '一键生成并分享超链接'}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center mt-2.5">
          说明：链接已自带 Base64 压缩 Manifest 协议，发给谁都能打开！
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// 可视化演示工坊主干组件 (DemoStudio)
// ============================================================================

export function DemoStudio() {
  return (
    <DemoProvider>
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] h-screen w-screen overflow-hidden bg-background dark:bg-background-dark">
        {/* 左侧配置栏 */}
        <StudioControlPanel />

        {/* 右侧实时高保真预览 */}
        <div className="flex flex-col h-full bg-secondary/35 dark:bg-secondary-dark/15 overflow-hidden relative">
          {/* 实时预览头部 */}
          <div className="h-14 border-b border-border dark:border-border-dark px-6 flex items-center justify-between bg-surface dark:bg-surface-dark shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="size-4.5 text-primary dark:text-primary-dark" />
              <span className="text-xs font-bold text-foreground dark:text-foreground-dark">
                高保真演示实时预览沙箱 (Presenter Sandbox)
              </span>
            </div>
            <Badge variant="gray" className="animate-pulse text-[10px] py-0.5">
              ● 实时渲染中
            </Badge>
          </div>

          {/* 演示播放渲染容器 */}
          <div className="flex-1 overflow-y-auto">
            <DemoPlayer />
          </div>
        </div>
      </div>
    </DemoProvider>
  );
}
