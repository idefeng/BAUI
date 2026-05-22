import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '../../../lib/utils';
import { mockProgress } from '../../../utils/mock';
import { uiStatusStyles, uiStyles, type UiProgressStatus } from '../shared/styles';

export type ProgressStatus = UiProgressStatus;

export interface ProgressProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>, 'value' | 'max'> {
  /** 当前进度值，默认按 0 到 100 计算百分比。 */
  value?: number;
  /** 最大值，默认为 100。 */
  max?: number;
  /** 进度条语义标签，用作无障碍名称。 */
  label?: string;
  /** 进度状态；success 为绿色，exception 为红色。 */
  status?: ProgressStatus;
  /** 是否展示右侧百分比文字。 */
  showValue?: boolean;
  /** 是否开启加载中光浪动画。 */
  animated?: boolean;
  /** 进度条外层轨道类名。 */
  trackClassName?: string;
  /** 进度条填充类名。 */
  indicatorClassName?: string;
  /** 启用培训业务 mock 进度；仅在未传 value/label/status 时兜底接管。 */
  mock?: boolean;
  /** Mock 进度偏移，用于 Storybook 展示不同进度状态。 */
  mockSeed?: number;
}

const clampValue = (value: number, max: number) => Math.min(max, Math.max(0, value));

const getPercentage = (value: number, max: number) => Math.round((clampValue(value, max) / max) * 100);

/** Progress 基于 Radix Progress 封装，适合课程进度、任务完成率和加载状态。 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      animated = false,
      className,
      indicatorClassName,
      label,
      max = 100,
      mock = false,
      mockSeed = 0,
      showValue = true,
      status,
      trackClassName,
      value,
      ...props
    },
    ref,
  ) => {
    const mockData = React.useMemo(() => (mock ? mockProgress(mockSeed) : undefined), [mock, mockSeed]);
    const safeMax = Math.max(1, max);
    const displayValue = clampValue(value ?? mockData?.value ?? 0, safeMax);
    const displayLabel = label ?? mockData?.label;
    const displayStatus = status ?? mockData?.status ?? 'normal';
    const percentage = getPercentage(displayValue, safeMax);

    return (
      <div className={cn('w-full space-y-2', className)}>
        {(displayLabel || showValue) ? (
          <div className="flex items-center justify-between gap-4 text-sm">
            {displayLabel ? (
              <span className={cn('truncate font-medium', uiStyles.textForeground)}>{displayLabel}</span>
            ) : (
              <span />
            )}
            {showValue ? (
              <span className={cn('shrink-0 font-semibold', uiStyles.textForeground)}>{percentage}%</span>
            ) : null}
          </div>
        ) : null}
        <ProgressPrimitive.Root
          ref={ref}
          value={displayValue}
          max={safeMax}
          aria-label={displayLabel}
          className={cn(
            'relative h-2 w-full overflow-hidden rounded-full bg-muted dark:bg-muted-dark',
            trackClassName,
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            data-testid="boao-progress-indicator"
            className={cn(
              'relative h-full rounded-full transition-all duration-500 ease-out',
              uiStatusStyles.progress[displayStatus],
              animated && 'overflow-hidden',
              indicatorClassName,
            )}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          >
            {animated ? (
              <span
                data-testid="boao-progress-shine"
                className="absolute inset-y-0 left-0 w-1/3 animate-progress-shine bg-surface/40 dark:bg-surface/20"
              />
            ) : null}
          </ProgressPrimitive.Indicator>
        </ProgressPrimitive.Root>
      </div>
    );
  },
);

Progress.displayName = 'Progress';
