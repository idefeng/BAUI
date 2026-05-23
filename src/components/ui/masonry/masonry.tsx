import * as React from 'react';

import { cn } from '../../../lib/utils';

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS columns 数量，适合瀑布流式卡片预览。 */
  columns?: number;
  /** 列间距，数字会转换为 px。 */
  gap?: number | string;
  /** 测试定位属性，默认用于验证瀑布流容器样式。 */
  'data-testid'?: string;
}

const toCssLength = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

export const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  (
    {
      children,
      className,
      columns = 3,
      gap = 16,
      style,
      'data-testid': dataTestId = 'boao-masonry',
      ...props
    },
    ref,
  ) => (
    <div
      {...props}
      ref={ref}
      data-testid={dataTestId}
      className={cn('[&>*]:mb-4 [&>*]:break-inside-avoid', className)}
      style={{
        ...style,
        columnCount: Math.max(1, Math.floor(columns)),
        columnGap: toCssLength(gap),
      }}
    >
      {children}
    </div>
  ),
);

Masonry.displayName = 'Masonry';
