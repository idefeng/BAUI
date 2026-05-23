import * as React from 'react';
import { Check, Circle, LoaderCircle, X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type StepsDirection = 'horizontal' | 'vertical';
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

export interface StepItem {
  /** 步骤标题。 */
  title: React.ReactNode;
  /** 步骤说明。 */
  description?: React.ReactNode;
  /** 手动覆盖步骤状态；不传时按 current 自动推导。 */
  status?: StepStatus;
  /** 禁用后不可点击。 */
  disabled?: boolean;
}

export interface StepsProps extends Omit<React.HTMLAttributes<HTMLOListElement>, 'onChange'> {
  /** 当前步骤索引，从 0 开始。 */
  current?: number;
  /** 步骤项。 */
  items: StepItem[];
  /** 排列方向。 */
  direction?: StepsDirection;
  /** 点击步骤回调；存在时步骤会渲染为按钮。 */
  onChange?: (index: number) => void;
}

const getStepStatus = (index: number, current: number, status?: StepStatus): StepStatus => {
  if (status) {
    return status;
  }

  if (index < current) {
    return 'finish';
  }

  if (index === current) {
    return 'process';
  }

  return 'wait';
};

const statusClasses: Record<StepStatus, string> = {
  wait: 'border-border bg-surface text-muted-foreground dark:border-border-dark dark:bg-surface-dark dark:text-muted-dark-foreground',
  process:
    'border-primary bg-primary text-primary-foreground shadow-button dark:border-primary-dark dark:bg-primary-dark dark:text-primary-dark-foreground',
  finish:
    'border-success bg-success-soft text-success dark:border-success-dark dark:bg-success-dark-soft dark:text-success-dark',
  error:
    'border-danger bg-danger-soft text-danger dark:border-danger-dark dark:bg-danger-dark-soft dark:text-danger-dark',
};

const textClasses: Record<StepStatus, string> = {
  wait: uiStyles.textMuted,
  process: uiStyles.textForeground,
  finish: uiStyles.textForeground,
  error: 'text-danger dark:text-danger-dark',
};

const StatusIcon = ({ status }: { status: StepStatus }) => {
  if (status === 'finish') {
    return <Check className="size-4" aria-hidden="true" />;
  }

  if (status === 'process') {
    return <LoaderCircle className="size-4" aria-hidden="true" />;
  }

  if (status === 'error') {
    return <X className="size-4" aria-hidden="true" />;
  }

  return <Circle className="size-3" aria-hidden="true" />;
};

/** Steps 用于培训项目创建、审核和证书签发等流程导航。 */
export const Steps = React.forwardRef<HTMLOListElement, StepsProps>(
  ({ className, current = 0, direction = 'horizontal', items, onChange, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        'flex gap-4',
        direction === 'vertical' ? 'flex-col' : 'items-start',
        className,
      )}
      {...props}
    >
      {items.map((item, index) => {
        const status = getStepStatus(index, current, item.status);
        const clickable = Boolean(onChange) && !item.disabled;
        const content = (
          <>
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                statusClasses[status],
              )}
            >
              <StatusIcon status={status} />
            </span>
            <span className="min-w-0 text-left">
              <span className={cn('block text-sm font-semibold', textClasses[status])}>{item.title}</span>
              {item.description ? <span className={cn('mt-1 block text-xs', uiStyles.textMuted)}>{item.description}</span> : null}
            </span>
          </>
        );

        return (
          <li
            key={`${index}-${String(item.title)}`}
            data-status={status}
            className={cn('relative flex min-w-0 flex-1 items-start gap-3', direction === 'vertical' && 'flex-none')}
          >
            {clickable ? (
              <button
                type="button"
                className={cn('flex min-w-0 items-start gap-3 rounded-2xl p-1 transition-colors', uiStyles.focusRing, uiStyles.primarySurfaceHover)}
                onClick={() => onChange?.(index)}
              >
                {content}
              </button>
            ) : (
              <div className="flex min-w-0 items-start gap-3 p-1">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  ),
);

Steps.displayName = 'Steps';
