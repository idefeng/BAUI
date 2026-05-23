import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type SplitterOrientation = 'horizontal' | 'vertical';

export interface SplitterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onResize'> {
  /** 分割方向：horizontal 为左右分栏，vertical 为上下分栏。 */
  orientation?: SplitterOrientation;
  /** 当前尺寸百分比；传入后组件进入受控模式。 */
  sizes?: number[];
  /** 非受控模式下的初始尺寸百分比。 */
  defaultSizes?: number[];
  /** 单个面板最小百分比。 */
  min?: number;
  /** 键盘调整步长。 */
  step?: number;
  /** 尺寸变化回调。 */
  onResize?: (sizes: number[]) => void;
}

const normalizeSizes = (count: number, sizes: number[] | undefined) => {
  if (count <= 0) {
    return [];
  }

  if (!sizes || sizes.length !== count) {
    const equalSize = 100 / count;
    return Array.from({ length: count }, () => equalSize);
  }

  const total = sizes.reduce((sum, size) => sum + size, 0) || 100;

  return sizes.map((size) => (size / total) * 100);
};

const resizePair = (sizes: number[], index: number, delta: number, min: number) => {
  const nextSizes = [...sizes];
  const left = nextSizes[index];
  const right = nextSizes[index + 1];
  const nextLeft = Math.min(Math.max(left + delta, min), left + right - min);

  nextSizes[index] = nextLeft;
  nextSizes[index + 1] = left + right - nextLeft;

  return nextSizes;
};

export const Splitter = React.forwardRef<HTMLDivElement, SplitterProps>(
  (
    {
      children,
      className,
      defaultSizes,
      min = 10,
      onResize,
      orientation = 'horizontal',
      sizes,
      step = 5,
      ...props
    },
    ref,
  ) => {
    const panes = React.Children.toArray(children);
    const isControlled = sizes !== undefined;
    const [innerSizes, setInnerSizes] = React.useState(() => normalizeSizes(panes.length, defaultSizes));
    const actualSizes = normalizeSizes(panes.length, isControlled ? sizes : innerSizes);

    const updateSizes = (nextSizes: number[]) => {
      if (!isControlled) {
        setInnerSizes(nextSizes);
      }

      onResize?.(nextSizes.map((size) => Number(size.toFixed(4))));
    };

    const handleKeyboardResize = (index: number, event: React.KeyboardEvent<HTMLButtonElement>) => {
      const positiveKeys = orientation === 'horizontal' ? ['ArrowRight'] : ['ArrowDown'];
      const negativeKeys = orientation === 'horizontal' ? ['ArrowLeft'] : ['ArrowUp'];

      if (![...positiveKeys, ...negativeKeys].includes(event.key)) {
        return;
      }

      event.preventDefault();

      // 每个 separator 只调整相邻两个面板，避免影响更远区域。
      const delta = positiveKeys.includes(event.key) ? step : -step;

      updateSizes(resizePair(actualSizes, index, delta, min));
    };

    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          'flex min-h-0 min-w-0 overflow-hidden rounded-2xl border border-border bg-surface dark:border-border-dark dark:bg-surface-dark',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          className,
        )}
      >
        {panes.map((pane, index) => (
          <React.Fragment key={index}>
            <div
              className="min-h-0 min-w-0 overflow-auto p-4"
              style={{ flex: `0 0 ${actualSizes[index]}%` }}
            >
              {pane}
            </div>
            {index < panes.length - 1 ? (
              <button
                type="button"
                role="separator"
                aria-orientation={orientation}
                aria-valuemin={min}
                aria-valuemax={100 - min}
                aria-valuenow={Number(actualSizes[index].toFixed(4))}
                aria-label="调整面板尺寸"
                className={cn(
                  'shrink-0 bg-border transition-colors hover:bg-primary focus:bg-primary dark:bg-border-dark dark:hover:bg-primary-dark dark:focus:bg-primary-dark',
                  uiStyles.buttonFocusVisibleRing,
                  orientation === 'vertical' ? 'h-1.5 w-full cursor-row-resize' : 'h-auto w-1.5 cursor-col-resize',
                )}
                onKeyDown={(event) => handleKeyboardResize(index, event)}
              />
            ) : null}
          </React.Fragment>
        ))}
      </div>
    );
  },
);

Splitter.displayName = 'Splitter';
