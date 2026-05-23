import * as React from 'react';
import { Star } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockRateValue } from '../../../utils/mock';
import { uiStyles } from '../shared/styles';

export interface RateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 当前评分；传入后组件进入受控模式。 */
  value?: number;
  /** 非受控模式下的初始评分。 */
  defaultValue?: number;
  /** 评分总数，默认 5 星。 */
  count?: number;
  /** 是否允许再次点击当前分值清空。 */
  allowClear?: boolean;
  /** 禁用后不可修改评分。 */
  disabled?: boolean;
  /** 分值变化回调，清空时返回 0。 */
  onChange?: (value: number) => void;
  /** 开启后在未传 value/defaultValue 时使用中央 mock 评分。 */
  mock?: boolean;
  /** 自定义评分图标，默认使用 lucide-react Star。 */
  character?: React.ReactNode;
}

const clampRateValue = (value: number, count: number) => Math.min(Math.max(Math.round(value), 0), count);

export const Rate = React.forwardRef<HTMLDivElement, RateProps>(
  (
    {
      allowClear = true,
      character,
      className,
      count = 5,
      defaultValue,
      disabled = false,
      mock = false,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const safeCount = Math.max(1, Math.floor(count));
    const initialValue = defaultValue ?? (mock && value === undefined ? mockRateValue() : 0);
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState(() => clampRateValue(initialValue, safeCount));
    const currentValue = clampRateValue(isControlled ? value : innerValue, safeCount);

    const handleSelect = (nextValue: number) => {
      if (disabled) {
        return;
      }

      // allowClear 对齐评分表单的常见行为，再次点击当前分值清空选择。
      const finalValue = allowClear && currentValue === nextValue ? 0 : nextValue;

      if (!isControlled) {
        setInnerValue(finalValue);
      }

      onChange?.(finalValue);
    };

    return (
      <div
        {...props}
        ref={ref}
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={cn('inline-flex items-center gap-1', className)}
      >
        {Array.from({ length: safeCount }, (_, index) => {
          const rateValue = index + 1;
          const checked = rateValue <= currentValue;

          return (
            <button
              key={rateValue}
              type="button"
              role="radio"
              aria-checked={rateValue === currentValue}
              aria-label={`${rateValue} 星`}
              disabled={disabled}
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-xl transition-all duration-150',
                uiStyles.buttonFocusVisibleRing,
                disabled
                  ? 'cursor-not-allowed text-disabled-foreground dark:text-disabled-dark-foreground'
                  : 'hover:bg-warning-soft hover:text-warning dark:hover:bg-warning-dark-soft dark:hover:text-warning-dark',
                checked
                  ? 'text-warning dark:text-warning-dark'
                  : 'text-muted-foreground dark:text-muted-dark-foreground',
              )}
              onClick={() => handleSelect(rateValue)}
            >
              <span className="inline-flex size-5 items-center justify-center [&>svg]:size-5">
                {character ?? <Star className={checked ? 'fill-current' : undefined} aria-hidden="true" />}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);

Rate.displayName = 'Rate';
