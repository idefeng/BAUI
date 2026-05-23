import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerTextAlign = 'left' | 'center' | 'right';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 分割线方向，vertical 适合工具栏内分隔图标按钮。 */
  orientation?: DividerOrientation;
  /** 带文案时的对齐方式。 */
  textAlign?: DividerTextAlign;
}

const alignClasses: Record<DividerTextAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

/** Divider 提供横向、纵向和带文案的轻量分隔能力。 */
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ children, className, orientation = 'horizontal', textAlign = 'center', ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn('mx-2 h-6 w-px shrink-0 bg-border dark:bg-border-dark', className)}
          {...props}
        />
      );
    }

    if (children) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn('my-4 flex w-full items-center gap-3', alignClasses[textAlign], className)}
          {...props}
        >
          <span className="h-px min-w-8 flex-1 bg-border dark:bg-border-dark" aria-hidden="true" />
          <span className={cn('shrink-0 text-xs font-medium', uiStyles.textMuted)}>{children}</span>
          <span className="h-px min-w-8 flex-1 bg-border dark:bg-border-dark" aria-hidden="true" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn('my-4 h-px w-full bg-border dark:bg-border-dark', className)}
        {...props}
      />
    );
  },
);

Divider.displayName = 'Divider';
