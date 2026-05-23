import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type SegmentedValue = string | number;
export type SegmentedSize = 'sm' | 'md' | 'lg';

export interface SegmentedOption {
  /** 选项展示内容。 */
  label: React.ReactNode;
  /** 选项值。 */
  value: SegmentedValue;
  /** 左侧图标。 */
  icon?: React.ReactNode;
  /** 禁用后不可选中。 */
  disabled?: boolean;
}

export interface SegmentedProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** 选项列表。 */
  options: SegmentedOption[];
  /** 受控选中值。 */
  value?: SegmentedValue;
  /** 非受控默认值。 */
  defaultValue?: SegmentedValue;
  /** 选中值变化回调。 */
  onValueChange?: (value: SegmentedValue) => void;
  /** 尺寸。 */
  size?: SegmentedSize;
  /** 是否整体禁用。 */
  disabled?: boolean;
}

const sizeClasses: Record<SegmentedSize, string> = {
  sm: 'min-h-8 px-3 py-1 text-xs',
  md: 'min-h-10 px-4 py-2 text-sm',
  lg: 'min-h-11 px-5 py-2.5 text-sm',
};

const getInitialValue = (options: SegmentedOption[], defaultValue: SegmentedValue | undefined) =>
  defaultValue ?? options.find((option) => !option.disabled)?.value;

/** Segmented 用于同一维度下的轻量模式切换。 */
export const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (
    {
      className,
      defaultValue,
      disabled = false,
      onValueChange,
      options,
      size = 'md',
      value,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<SegmentedValue | undefined>(() =>
      getInitialValue(options, defaultValue),
    );
    const selectedValue = isControlled ? value : internalValue;

    const selectValue = (option: SegmentedOption) => {
      if (disabled || option.disabled) {
        return;
      }

      if (!isControlled) {
        setInternalValue(option.value);
      }

      onValueChange?.(option.value);
    };

    return (
      <div
        ref={ref}
        role="group"
        className={cn('inline-flex rounded-2xl bg-secondary p-1 dark:bg-secondary-dark', className)}
        {...props}
      >
        {options.map((option) => {
          const selected = option.value === selectedValue;

          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={selected}
              disabled={disabled || option.disabled}
              className={cn(
                'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200',
                sizeClasses[size],
                selected
                  ? 'bg-surface text-primary shadow-sm dark:bg-surface-dark dark:text-primary-dark'
                  : uiStyles.textMuted,
                !selected && !disabled && !option.disabled && 'hover:text-primary dark:hover:text-primary-dark',
                uiStyles.buttonFocusVisibleRing,
                uiStyles.buttonDisabled,
              )}
              onClick={() => selectValue(option)}
            >
              {option.icon ? <span className={uiStyles.iconSlot}>{option.icon}</span> : null}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  },
);

Segmented.displayName = 'Segmented';
