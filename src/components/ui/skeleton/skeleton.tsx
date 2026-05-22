import * as React from 'react';

import { cn } from '../../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Skeleton 通用骨架屏，形状和尺寸通过 className 自由组合。 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, 'aria-hidden': ariaHidden = true, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden={ariaHidden}
      className={cn(
        'animate-pulse rounded-xl bg-muted text-transparent dark:bg-muted-dark',
        // 默认提供一块可见占位，业务侧可用 h/w/rounded-full 等 className 覆盖形状。
        'h-4 w-full',
        className,
      )}
      {...props}
    />
  ),
);

Skeleton.displayName = 'Skeleton';
