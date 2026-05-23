import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否播放呼吸动画，用于品牌展示和重点入口。 */
  animated?: boolean;
  /** 测试定位属性，默认用于验证动画边框容器。 */
  'data-testid'?: string;
}

export const BorderBeam = React.forwardRef<HTMLDivElement, BorderBeamProps>(
  (
    {
      animated = true,
      children,
      className,
      'data-testid': dataTestId = 'boao-border-beam',
      ...props
    },
    ref,
  ) => (
    <div
      {...props}
      ref={ref}
      data-testid={dataTestId}
      data-animated={animated ? 'true' : 'false'}
      className={cn(
        'relative overflow-hidden rounded-2xl p-px',
        animated && 'animate-pulse',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl bg-primary/60 dark:bg-primary-dark/60"
      />
      <div className={cn('relative rounded-2xl', uiStyles.surfaceShell)}>
        {children}
      </div>
    </div>
  ),
);

BorderBeam.displayName = 'BorderBeam';
