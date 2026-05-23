import * as React from 'react';
import { Minus, Plus } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { clampNumber } from '../shared/logic';
import { uiStyles } from '../shared/styles';

export interface InputNumberProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'defaultValue' | 'onChange' | 'type' | 'value'> {
  /** 受控数值。 */
  value?: number;
  /** 非受控初始数值。 */
  defaultValue?: number;
  /** 数值变化回调；输入为空时返回 undefined。 */
  onChange?: (value: number | undefined) => void;
  /** 最小值。 */
  min?: number;
  /** 最大值。 */
  max?: number;
  /** 步长，默认 1。 */
  step?: number;
  /** 开启后在没有 value/defaultValue 时填充培训人数示例值。 */
  mock?: boolean;
}

const normalizeValue = (value: number | undefined, min?: number, max?: number) => {
  if (value === undefined || Number.isNaN(value)) {
    return undefined;
  }

  return clampNumber(value, min ?? Number.NEGATIVE_INFINITY, max ?? Number.POSITIVE_INFINITY);
};

const getInputTextValue = (value: number | undefined) => (value === undefined ? '' : String(value));

/** InputNumber 提供带增减按钮的数字输入，适合人数、课时和金额类字段。 */
export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      className,
      defaultValue,
      disabled = false,
      max,
      min,
      mock = false,
      onChange,
      step = 1,
      value,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<number | undefined>(() =>
      normalizeValue(defaultValue ?? (mock ? 128 : undefined), min, max),
    );
    const actualValue = normalizeValue(isControlled ? value : internalValue, min, max);

    const commitValue = (nextValue: number | undefined) => {
      const normalizedValue = normalizeValue(nextValue, min, max);

      if (!isControlled) {
        setInternalValue(normalizedValue);
      }

      onChange?.(normalizedValue);
    };

    const shiftValue = (offset: number) => {
      commitValue((actualValue ?? 0) + offset);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextText = event.currentTarget.value;

      commitValue(nextText === '' ? undefined : Number(nextText));
    };

    return (
      <div className={cn('flex w-full items-center gap-2', className)}>
        <button
          type="button"
          aria-label="减少数值"
          disabled={disabled || (actualValue !== undefined && min !== undefined && actualValue <= min)}
          className={cn('size-9 shrink-0', uiStyles.iconGhostButton, uiStyles.buttonDisabled)}
          onClick={() => shiftValue(-step)}
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <input
          {...props}
          ref={ref}
          type="number"
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          value={getInputTextValue(actualValue)}
          onChange={handleInputChange}
          className={cn(
            'text-center shadow-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            uiStyles.controlBase,
            uiStyles.focusRing,
            uiStyles.controlDisabled,
            !disabled && uiStyles.formControlHover,
          )}
        />
        <button
          type="button"
          aria-label="增加数值"
          disabled={disabled || (actualValue !== undefined && max !== undefined && actualValue >= max)}
          className={cn('size-9 shrink-0', uiStyles.iconGhostButton, uiStyles.buttonDisabled)}
          onClick={() => shiftValue(step)}
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  },
);

InputNumber.displayName = 'InputNumber';
