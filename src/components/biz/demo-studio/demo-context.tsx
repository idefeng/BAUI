import * as React from 'react';

// ============================================================================
// 类型声明区 (Type Definitions)
// ============================================================================

export interface DemoBranding {
  /** 演示系统标题 */
  title: string;
  /** 主题色十六进制代码 (e.g. #0052D9) */
  primaryColor: string;
  /** 自定义 Logo 地址 */
  logo: string;
  /** 是否开启防伪水印 */
  watermark: boolean;
}

export interface DemoContextData {
  /** 培训项目代号 */
  ba_training_project?: string;
  /** 培训岗位代号 */
  ba_trainning_title?: string;
  /** 培训类型代号 */
  ba_trainning_type?: string;
  /** 属地范围 Adcode */
  ba_region_scope?: string;
}

export type DemoPageType = 'login' | 'dashboard' | 'table' | 'profile';

export interface DemoPageConfig {
  /** 页面唯一 ID */
  id: string;
  /** 预设页面类型 */
  type: DemoPageType;
  /** 专有子配置 (例如 login 风格, dashboard 类别) */
  style?: string;
  pageType?: string;
  mockType?: string;
}

export interface DemoManifest {
  meta: {
    version: string;
    demoName: string;
  };
  branding: DemoBranding;
  context: DemoContextData;
  flow: DemoPageConfig[];
}

export interface DemoContextValue {
  /** 当前激活页面 ID */
  activePageId: string;
  /** 当前运行的 Manifest */
  manifest: DemoManifest;
  /** 切换激活页面 */
  setActivePageId: (id: string) => void;
  /** 更新 Manifest 属性 */
  updateManifest: (updater: (prev: DemoManifest) => DemoManifest) => void;
  /** 重置演示会话 */
  resetDemo: () => void;
}

// ============================================================================
// 上下文与 Provider 实现 (Context & Utility Functions)
// ============================================================================

export const DemoContext = React.createContext<DemoContextValue | undefined>(undefined);

/**
 * 将十六进制颜色解析为 RGB 对象
 */
function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 82, b: 217 }; // 默认 TDesign 科技蓝
}

/**
 * 根据主色调十六进制代码，智能计算并推导全套 8 种高内聚主题色彩变量字典
 */
export function generateThemeColors(primaryHex: string): React.CSSProperties {
  const { r, g, b } = hexToRgb(primaryHex);

  // 饱和度/明暗度调节辅助函数
  const adjustColor = (amount: number) => {
    const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
    return `rgb(${clamp(r + amount)}, ${clamp(g + amount)}, ${clamp(b + amount)})`;
  };

  // 亮色模式变体
  const hover = adjustColor(-18);  // 稍深
  const active = adjustColor(-35); // 深
  const soft = `rgba(${r}, ${g}, ${b}, 0.09)`; // 轻量半透背景

  // 暗色模式变体（高对比度适配）
  const dark = adjustColor(30);    // 稍亮，防暗背景低对比
  const darkHover = adjustColor(50);
  const darkActive = adjustColor(70);
  const darkSoft = `rgba(${r}, ${g}, ${b}, 0.18)`;

  return {
    '--color-primary': primaryHex,
    '--color-primary-foreground': '#FFFFFF',
    '--color-primary-hover': hover,
    '--color-primary-active': active,
    '--color-primary-soft': soft,
    '--color-primary-dark': dark,
    '--color-primary-dark-foreground': '#020617',
    '--color-primary-dark-hover': darkHover,
    '--color-primary-dark-active': darkActive,
    '--color-primary-dark-soft': darkSoft,
  } as React.CSSProperties;
}

export const useDemo = () => {
  const context = React.useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo 必须在 DemoProvider 下才能正确被消费。');
  }
  return context;
};
