import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '../../../lib/utils';

export type SliderValue = number | [number, number];

type SliderPrimitiveProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

export interface SliderProps
  extends Omit<SliderPrimitiveProps, 'defaultValue' | 'disabled' | 'max' | 'min' | 'onChange' | 'onValueChange' | 'step' | 'value'> {
  /** 最小值，默认 0。 */
  min?: number;
  /** 最大值，默认 100。 */
  max?: number;
  /** 步长，默认 1。 */
  step?: number;
  /** 受控值；number 渲染单滑块，tuple 渲染范围双滑块。 */
  value: SliderValue;
  /** 值变化时回传与 value 相同形态的数据。 */
  onChange: (value: SliderValue) => void;
  /** 禁用滑块交互。 */
  disabled?: boolean;
}

const isRangeValue = (value: SliderValue): value is [number, number] => Array.isArray(value);

const toRadixValue = (value: SliderValue) => (isRangeValue(value) ? value : [value]);

/** 将 Radix number[] 映射回业务侧的 number 或 tuple，保证 Form 受控值形态稳定。 */
const toExternalValue = (nextValue: number[], rangeMode: boolean, fallback: SliderValue): SliderValue => {
  if (rangeMode) {
    const currentValue = isRangeValue(fallback) ? fallback : [fallback, fallback];

    return [nextValue[0] ?? currentValue[0], nextValue[1] ?? currentValue[1]];
  }

  return nextValue[0] ?? (isRangeValue(fallback) ? fallback[0] : fallback);
};

/** Slider 高颜值表单滑块，基于 Radix Slider 封装单值和范围选择。 */
export const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      disabled = false,
      max = 100,
      min = 0,
      onChange,
      step = 1,
      value,
      ...props
    },
    ref,
  ) => {
    const rangeMode = isRangeValue(value);
    const radixValue = toRadixValue(value);
    const [activeThumbIndex, setActiveThumbIndex] = React.useState<number | null>(null);
    const ariaLabel = props['aria-label'];

    const handleValueChange = (nextValue: number[]) => {
      onChange(toExternalValue(nextValue, rangeMode, value));
    };

    const clearActiveThumb = () => {
      setActiveThumbIndex(null);
    };

    return (
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={radixValue}
        disabled={disabled}
        onValueChange={handleValueChange}
        onPointerUp={clearActiveThumb}
        onPointerLeave={clearActiveThumb}
        data-testid="slider-root"
        className={cn(
          'relative flex w-full touch-none select-none items-center py-3 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60',
          'dark:text-foreground-dark',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-secondary dark:bg-secondary-dark">
          <SliderPrimitive.Range
            data-testid="slider-range"
            className="absolute h-full rounded-full bg-primary dark:bg-primary-dark"
          />
        </SliderPrimitive.Track>

        {radixValue.map((thumbValue, index) => (
          <SliderPrimitive.Thumb
            // Radix 以 thumb 顺序管理范围值，这里使用 index 保持双滑块 DOM 稳定。
            key={index}
            aria-label={ariaLabel}
            onFocus={() => setActiveThumbIndex(index)}
            onBlur={clearActiveThumb}
            onPointerDown={() => setActiveThumbIndex(index)}
            className={cn(
              'group relative block size-5 rounded-full border border-border bg-surface shadow-md outline-none transition-all duration-200',
              'hover:scale-110 focus:scale-110 focus:ring-4 focus:ring-primary/20 active:scale-110',
              'data-[disabled]:cursor-not-allowed data-[disabled]:bg-disabled',
              'dark:border-border-dark dark:bg-surface-dark dark:shadow-sm dark:focus:ring-primary-dark/30 dark:data-[disabled]:bg-disabled-dark',
            )}
          >
            {activeThumbIndex === index ? (
              <span
                role="tooltip"
                className={cn(
                  'pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-9 rounded-lg bg-foreground px-2.5 py-1 text-xs font-semibold text-background shadow-lg',
                  'animate-select-in dark:bg-foreground-dark dark:text-background-dark',
                )}
              >
                {thumbValue}
              </span>
            ) : null}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
    );
  },
);

Slider.displayName = SliderPrimitive.Root.displayName;
