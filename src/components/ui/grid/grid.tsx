import * as React from 'react';

import { cn } from '../../../lib/utils';

export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridSpan = 1 | 2 | 3 | 4 | 5 | 6 | 12;

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 中等屏以上的列数，移动端默认单列。 */
  columns?: GridColumns;
  /** 栅格间距。 */
  gap?: GridGap;
}

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 中等屏以上占用列数。 */
  span?: GridSpan;
}

const gapClasses: Record<GridGap, string> = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
};

const columnClasses: Record<GridColumns, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  12: 'md:grid-cols-12',
};

const spanClasses: Record<GridSpan, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  12: 'md:col-span-12',
};

/** Row 是响应式栅格行容器，移动端单列，中等屏按 columns 展开。 */
export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({ className, columns = 2, gap = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('grid grid-cols-1', columnClasses[columns], gapClasses[gap], className)}
      {...props}
    />
  ),
);

Row.displayName = 'Row';

/** Col 是响应式栅格列，span 用于让关键卡片跨列展示。 */
export const Col = React.forwardRef<HTMLDivElement, ColProps>(
  ({ className, span = 1, ...props }, ref) => (
    <div ref={ref} className={cn('min-w-0', spanClasses[span], className)} {...props} />
  ),
);

Col.displayName = 'Col';
