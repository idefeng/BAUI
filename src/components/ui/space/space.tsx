import * as React from 'react';

import { cn } from '../../../lib/utils';

export type SpaceDirection = 'horizontal' | 'vertical';
export type SpaceSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpaceAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 排列方向，vertical 用于表单项或说明文本堆叠。 */
  direction?: SpaceDirection;
  /** 间距尺寸。 */
  size?: SpaceSize;
  /** 交叉轴对齐方式。 */
  align?: SpaceAlign;
  /** 是否允许换行，常用于批量按钮或标签组合。 */
  wrap?: boolean;
}

const sizeClasses: Record<SpaceSize, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
};

const alignClasses: Record<SpaceAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

/** Space 提供稳定间距容器，避免业务侧重复拼 gap/flex class。 */
export const Space = React.forwardRef<HTMLDivElement, SpaceProps>(
  (
    {
      align = 'center',
      children,
      className,
      direction = 'horizontal',
      size = 'md',
      wrap = false,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        alignClasses[align],
        sizeClasses[size],
        wrap && 'flex-wrap',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

Space.displayName = 'Space';
