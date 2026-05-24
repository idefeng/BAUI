import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { Button } from '../button';
import { clampNumber } from '../shared/logic';
import { uiStyles } from '../shared/styles';

export interface TourStep {
  title: React.ReactNode;
  description?: React.ReactNode;
  target?: string;
}

export interface TourProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 是否展示引导浮层。 */
  open?: boolean;
  /** 引导步骤列表。 */
  steps: TourStep[];
  /** 当前步骤索引；传入后组件进入受控模式。 */
  current?: number;
  /** 非受控模式下的初始步骤索引。 */
  defaultCurrent?: number;
  /** 当前步骤变化回调。 */
  onCurrentChange?: (current: number) => void;
  /** 关闭或完成时的回调。 */
  onClose?: () => void;
}

export const Tour = React.forwardRef<HTMLDivElement, TourProps>(
  (
    {
      className,
      current,
      defaultCurrent = 0,
      onClose,
      onCurrentChange,
      open = false,
      steps,
      ...props
    },
    ref,
  ) => {
    const isControlled = current !== undefined;
    const [innerCurrent, setInnerCurrent] = React.useState(defaultCurrent);
    const safeCurrent = clampNumber(isControlled ? current : innerCurrent, 0, Math.max(steps.length - 1, 0));
    const activeStep = steps[safeCurrent];
    const titleId = React.useId();

    if (!open || !activeStep) {
      return null;
    }

    const updateCurrent = (nextCurrent: number) => {
      if (!isControlled) {
        setInnerCurrent(nextCurrent);
      }

      onCurrentChange?.(nextCurrent);
    };

    const goNext = () => {
      if (safeCurrent >= steps.length - 1) {
        onClose?.();
        return;
      }

      updateCurrent(safeCurrent + 1);
    };

    return (
      <div
        {...props}
        ref={ref}
        className={cn('fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm dark:bg-background-dark/70', className)}
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn('w-full max-w-md p-5', uiStyles.floatingContent)}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className={uiStyles.heading}>
                {activeStep.title}
              </h2>
              {activeStep.description ? (
                <p className={cn('mt-2', uiStyles.description)}>{activeStep.description}</p>
              ) : null}
            </div>
            <button type="button" aria-label="关闭引导" className={cn('size-8', uiStyles.closeButton)} onClick={onClose}>
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className={cn('mb-5 text-sm', uiStyles.textMuted)}>
            {safeCurrent + 1} / {steps.length}
          </div>
          <div className="flex items-center justify-end gap-2">
            {safeCurrent > 0 ? (
              <Button variant="ghost" onClick={() => updateCurrent(safeCurrent - 1)}>
                上一步
              </Button>
            ) : null}
            <Button onClick={goNext}>{safeCurrent >= steps.length - 1 ? '完成' : '下一步'}</Button>
          </div>
        </section>
      </div>
    );
  },
);

Tour.displayName = 'Tour';
