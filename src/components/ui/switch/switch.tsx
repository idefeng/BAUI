import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

type SwitchPrimitiveProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>;

export interface SwitchProps
  extends Omit<SwitchPrimitiveProps, 'checked' | 'onChange' | 'onCheckedChange'> {
  /** Form 标准受控开关值。 */
  checked?: boolean;
  /** Form 标准变更回调，只返回 boolean。 */
  onChange?: (checked: boolean) => void;
  /** 保留 Radix 原始回调，兼容既有调用方。 */
  onCheckedChange?: (checked: boolean) => void;
}

/** Switch 表单原子组件，基于 Radix 保留键盘、禁用和 aria 语义。 */
export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ checked, className, onChange, onCheckedChange, ...props }, ref) => {
    const handleCheckedChange = (nextChecked: boolean) => {
      onCheckedChange?.(nextChecked);
      onChange?.(nextChecked);
    };

    return (
      <SwitchPrimitive.Root
        ref={ref}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        className={cn(
          'inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-secondary p-0.5 shadow-sm outline-none transition-all duration-200',
          uiStyles.focusRing,
          uiStyles.focusBreathingRing,
          uiStyles.formControlHover,
          'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary',
          uiStyles.radixDisabledControl,
          // 暗黑选中态使用浅主色轨道和深色拇指，避免深色背景下对比度不足。
          'dark:border-border-dark dark:bg-secondary-dark dark:data-[state=checked]:border-primary-dark dark:data-[state=checked]:bg-primary-dark dark:data-[state=unchecked]:bg-secondary-dark',
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            'pointer-events-none block size-5 rounded-full bg-surface shadow-sm transition-transform duration-200 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-primary-foreground',
            'data-[disabled]:bg-disabled-foreground dark:bg-surface-dark dark:shadow-sm dark:data-[state=checked]:bg-primary-dark-foreground dark:data-[state=unchecked]:bg-muted-dark-foreground dark:data-[disabled]:bg-disabled-dark-foreground',
          )}
        />
      </SwitchPrimitive.Root>
    );
  },
);

Switch.displayName = SwitchPrimitive.Root.displayName;
