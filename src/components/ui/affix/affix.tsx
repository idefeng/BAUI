import * as React from 'react';

import { cn } from '../../../lib/utils';

export interface AffixProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 距离视口顶部的 sticky 偏移，默认 0。 */
  offsetTop?: number | string;
  /** 距离视口底部的 sticky 偏移；传入后优先使用底部吸附。 */
  offsetBottom?: number | string;
  /** 吸附层级，适合放在页面工具条或批量操作栏。 */
  zIndex?: number;
  /** 测试定位属性，默认用于验证吸附容器样式。 */
  'data-testid'?: string;
}

const toCssLength = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return value;
};

export const Affix = React.forwardRef<HTMLDivElement, AffixProps>(
  (
    {
      children,
      className,
      offsetBottom,
      offsetTop = 0,
      style,
      zIndex = 20,
      'data-testid': dataTestId = 'boao-affix',
      ...props
    },
    ref,
  ) => {
    const stickyStyle: React.CSSProperties = {
      ...style,
      position: 'sticky',
      zIndex,
    };

    if (offsetBottom !== undefined) {
      stickyStyle.bottom = toCssLength(offsetBottom);
    } else {
      stickyStyle.top = toCssLength(offsetTop);
    }

    return (
      <div
        {...props}
        ref={ref}
        data-testid={dataTestId}
        style={stickyStyle}
        className={cn('w-fit', className)}
      >
        {children}
      </div>
    );
  },
);

Affix.displayName = 'Affix';
