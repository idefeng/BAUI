import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockTechnologyInterestOptions } from '../../../utils/mock';
import { uiStyles } from '../shared/styles';

type CheckboxPrimitiveProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;
type CheckboxCheckedState = CheckboxPrimitiveProps['checked'];

export interface CheckboxProps
  extends Omit<CheckboxPrimitiveProps, 'checked' | 'onChange' | 'onCheckedChange'> {
  /** Form 标准受控勾选值；TreeSelect 等复杂组件可传入 indeterminate 半选态。 */
  checked?: CheckboxCheckedState;
  /** Form 标准变更回调，只返回 boolean。 */
  onChange?: (checked: boolean) => void;
  /** 保留 Radix 原始回调，兼容既有调用方。 */
  onCheckedChange?: (checked: CheckboxCheckedState) => void;
}

export interface CheckboxGroupOption {
  label: string;
  value: string;
}

export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** 多选项配置。mock=true 且未传 options 时使用企业 IT 技术方向选项。 */
  options?: CheckboxGroupOption[];
  /** 当前已选中的 value 数组。 */
  value?: string[];
  /** 非受控初始选中值。 */
  defaultValue?: string[];
  /** 多选值变化回调，返回完整 value 数组。 */
  onChange?: (value: string[]) => void;
  /** 禁用整组多选。 */
  disabled?: boolean;
  /** 开启后自动使用企业 IT 技术方向 mock 选项。 */
  mock?: boolean;
  /** 同组 checkbox 的 name，便于表单序列化。 */
  name?: string;
}

/** Checkbox 表单原子组件，支持 checked、unchecked 和 indeterminate 三种状态。 */
export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ checked, className, onChange, onCheckedChange, ...props }, ref) => {
    const handleCheckedChange = (nextChecked: CheckboxCheckedState) => {
      onCheckedChange?.(nextChecked);
      onChange?.(nextChecked === true);
    };

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        className={cn(
          uiStyles.choiceControlBase,
          'rounded-md text-primary-foreground transition-transform duration-200 data-[state=checked]:scale-105 data-[state=unchecked]:scale-100',
          uiStyles.focusRing,
          uiStyles.focusBreathingRing,
          uiStyles.formControlHover,
          'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
          uiStyles.radixDisabledControl,
          // 暗黑勾选态用浅蓝底和深色图标，保证在深色表单背景上的可读性。
          'dark:border-border-dark dark:bg-surface-dark dark:text-primary-dark-foreground dark:data-[state=checked]:border-primary-dark dark:data-[state=checked]:bg-primary-dark dark:data-[state=indeterminate]:border-primary-dark dark:data-[state=indeterminate]:bg-primary-dark',
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn(
            'flex items-center justify-center text-current',
            // 图标完全跟随 Radix data-state，避免非受控 indeterminate 点击后显示滞后。
            '[&[data-state=checked]_.boao-checkbox-check]:block [&[data-state=indeterminate]_.boao-checkbox-minus]:block',
          )}
        >
          <Check className="boao-checkbox-check hidden size-3.5" aria-hidden="true" />
          <Minus className="boao-checkbox-minus hidden size-3.5" aria-hidden="true" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      className,
      defaultValue = [],
      disabled = false,
      mock = false,
      name,
      onChange,
      options,
      value,
      ...props
    },
    ref,
  ) => {
    const resolvedOptions = options && options.length > 0 ? options : mock ? mockTechnologyInterestOptions() : [];
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = React.useState(defaultValue);
    const selectedValues = isControlled ? value : innerValue;

    const updateValue = (nextValue: string[]) => {
      if (!isControlled) {
        setInnerValue(nextValue);
      }

      onChange?.(nextValue);
    };

    const toggleValue = (optionValue: string, checked: boolean) => {
      const nextValue = checked
        ? [...selectedValues, optionValue].filter((item, index, array) => array.indexOf(item) === index)
        : selectedValues.filter((item) => item !== optionValue);

      updateValue(nextValue);
    };

    return (
      <div ref={ref} role="group" className={cn('grid gap-3', className)} {...props}>
        {resolvedOptions.map((option) => {
          const checked = selectedValues.includes(option.value);
          const checkboxId = `${name ?? 'checkbox-group'}-${option.value}`;

          return (
            <div key={option.value} className="flex items-center gap-3">
              <Checkbox
                id={checkboxId}
                name={name}
                value={option.value}
                aria-label={option.label}
                checked={checked}
                disabled={disabled}
                onChange={(nextChecked) => toggleValue(option.value, nextChecked)}
              />
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium text-foreground dark:text-foreground-dark',
                  disabled && 'text-disabled-foreground dark:text-disabled-dark-foreground',
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    );
  },
);

CheckboxGroup.displayName = 'CheckboxGroup';
