import * as React from 'react';

import { cn } from '../../../lib/utils';

export type FlexGap = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否使用垂直方向。 */
  vertical?: boolean;
  /** 主轴对齐方式。 */
  justify?: FlexJustify;
  /** 交叉轴对齐方式。 */
  align?: FlexAlign;
  /** 间距尺寸。 */
  gap?: FlexGap;
  /** 是否允许换行。 */
  wrap?: boolean;
}

const gapClasses: Record<FlexGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
};

const justifyClasses: Record<FlexJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const alignClasses: Record<FlexAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
};

/** Flex 提供比 Space 更通用的布局容器，适合表单栏、工具栏和页面区块。 */
export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      align = 'center',
      className,
      gap = 'md',
      justify = 'start',
      vertical = false,
      wrap = false,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex',
        vertical ? 'flex-col' : 'flex-row',
        justifyClasses[justify],
        alignClasses[align],
        gapClasses[gap],
        wrap && 'flex-wrap',
        className,
      )}
      {...props}
    />
  ),
);

Flex.displayName = 'Flex';
