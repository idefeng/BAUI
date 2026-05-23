import * as React from 'react';
import { Plus } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type FloatButtonVariant = 'primary' | 'success' | 'danger' | 'secondary';
export type FloatButtonPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export interface FloatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 悬浮按钮视觉状态，danger 用于异常上报等高风险入口。 */
  variant?: FloatButtonVariant;
  /** 固定位置，默认右下角。 */
  position?: FloatButtonPosition;
  /** 按钮图标，默认使用 Plus。 */
  icon?: React.ReactNode;
  /** 悬浮提示文案；当前组件直接渲染轻量提示，避免引入复杂浮层依赖。 */
  tooltip?: React.ReactNode;
}

const variantClasses: Record<FloatButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary-dark dark:text-primary-dark-foreground dark:hover:bg-primary-dark-hover',
  success:
    'bg-success text-success-foreground hover:bg-success-hover dark:bg-success-dark dark:text-success-dark-foreground dark:hover:bg-success-dark-hover',
  danger:
    'bg-danger text-danger-foreground hover:bg-danger-hover dark:bg-danger-dark dark:text-danger-dark-foreground dark:hover:bg-danger-dark-hover',
  secondary:
    'bg-surface text-foreground hover:bg-secondary-hover dark:bg-surface-dark dark:text-foreground-dark dark:hover:bg-secondary-dark-hover',
};

const positionClasses: Record<FloatButtonPosition, string> = {
  'bottom-right': 'bottom-8 right-8',
  'bottom-left': 'bottom-8 left-8',
  'top-right': 'right-8 top-8',
  'top-left': 'left-8 top-8',
};

const tooltipPositionClasses: Record<FloatButtonPosition, string> = {
  'bottom-right': 'right-full mr-3',
  'top-right': 'right-full mr-3',
  'bottom-left': 'left-full ml-3',
  'top-left': 'left-full ml-3',
};

/** FloatButton 用于全局快速新建、反馈和回到顶部等固定入口。 */
export const FloatButton = React.forwardRef<HTMLButtonElement, FloatButtonProps>(
  (
    {
      className,
      icon,
      position = 'bottom-right',
      tooltip,
      type = 'button',
      variant = 'primary',
      ...props
    },
    ref,
  ) => (
    <div className={cn('fixed z-40 flex items-center', positionClasses[position])}>
      {tooltip ? (
        <span
          className={cn(
            'pointer-events-none absolute whitespace-nowrap rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-tooltip dark:border-border-dark dark:bg-surface-dark',
            uiStyles.textForeground,
            tooltipPositionClasses[position],
          )}
        >
          {tooltip}
        </span>
      ) : null}
      <button
        ref={ref}
        type={type}
        className={cn(
          'fixed inline-flex size-12 items-center justify-center rounded-2xl shadow-button transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0',
          positionClasses[position],
          variantClasses[variant],
          uiStyles.buttonFocusVisibleRing,
          uiStyles.buttonDisabled,
          className,
        )}
        {...props}
      >
        <span className={uiStyles.iconSlot} aria-hidden="true">
          {icon ?? <Plus />}
        </span>
      </button>
    </div>
  ),
);

FloatButton.displayName = 'FloatButton';
