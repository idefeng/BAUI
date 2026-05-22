import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStatusStyles, type UiStatusVariant } from '../shared/styles';

export type BadgeVariant = UiStatusVariant;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 状态视觉类型；warning 用于待处理或需关注状态。 */
  variant?: BadgeVariant;
}

export interface BadgeDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 红点是否显示，关闭后仍保留包裹容器。 */
  show?: boolean;
  /** 红点无障碍名称，例如“未读消息”。 */
  label?: string;
  /** 红点自身额外样式。 */
  dotClassName?: string;
}

/** Badge 用于状态、数量或轻量标签展示。 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-2.5 py-1 text-xs font-semibold leading-none',
        uiStatusStyles.soft[variant],
        className,
      )}
      {...props}
    />
  ),
);

Badge.displayName = 'Badge';

/** BadgeDot 用于头像、图标等元素右上角红点提醒。 */
export const BadgeDot = React.forwardRef<HTMLSpanElement, BadgeDotProps>(
  ({ children, className, dotClassName, label = '状态提醒', show = true, ...props }, ref) => (
    <span ref={ref} className={cn('relative inline-flex', className)} {...props}>
      {children}
      {show ? (
        <span
          aria-label={label}
          className={cn(
            'absolute right-0 top-0 size-2.5 -translate-y-0.5 translate-x-0.5 rounded-full border-2 border-surface bg-danger shadow-sm dark:border-surface-dark dark:bg-danger-dark',
            dotClassName,
          )}
        />
      ) : null}
    </span>
  ),
);

BadgeDot.displayName = 'BadgeDot';
