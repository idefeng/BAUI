import * as React from 'react';

import { cn } from '../../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否启用横向高光滑过动画（默认为 true 启用极客光泽 Shimmer 效果；设为 false 时降级为原版 pulse 呼吸动画） */
  shimmer?: boolean;
}

/** Skeleton 通用骨架屏，形状和尺寸通过 className 自由组合。 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, shimmer = true, 'aria-hidden': ariaHidden = true, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden={ariaHidden}
      className={cn(
        'relative overflow-hidden rounded-xl bg-muted text-transparent dark:bg-muted-dark',
        shimmer
          ? 'before:absolute before:inset-0 before:content-[""] before:animate-progress-shine before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent dark:before:via-white/10'
          : 'animate-pulse',
        // 默认提供一块可见占位，业务侧可用 h/w/rounded-full 等 className 覆盖形状。
        'h-4 w-full',
        className,
      )}
      {...props}
    />
  ),
);

Skeleton.displayName = 'Skeleton';
