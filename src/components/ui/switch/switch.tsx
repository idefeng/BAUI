import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {}

/** Switch 表单原子组件，基于 Radix 保留键盘、禁用和 aria 语义。 */
export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-border bg-secondary p-0.5 shadow-sm outline-none transition-all duration-200',
        uiStyles.focusBreathingRing,
        'hover:border-primary/70 hover:bg-primary-soft data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary',
        'data-[disabled]:cursor-not-allowed data-[disabled]:border-border data-[disabled]:bg-disabled data-[disabled]:opacity-80',
        // 暗黑选中态使用浅主色轨道和深色拇指，避免深色背景下对比度不足。
        'dark:border-border-dark dark:bg-secondary-dark dark:hover:border-primary-dark/80 dark:hover:bg-primary-dark-soft dark:data-[state=checked]:border-primary-dark dark:data-[state=checked]:bg-primary-dark dark:data-[state=unchecked]:bg-secondary-dark dark:data-[disabled]:border-border-dark dark:data-[disabled]:bg-disabled-dark',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-5 rounded-full bg-surface shadow-button transition-transform duration-200 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-primary-foreground',
          'data-[disabled]:bg-disabled-foreground dark:bg-foreground-dark dark:data-[state=checked]:bg-primary-dark-foreground dark:data-[state=unchecked]:bg-muted-dark-foreground dark:data-[disabled]:bg-disabled-dark-foreground',
        )}
      />
    </SwitchPrimitive.Root>
  ),
);

Switch.displayName = SwitchPrimitive.Root.displayName;
