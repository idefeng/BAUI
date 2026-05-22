import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {}

/** Checkbox 表单原子组件，支持 checked、unchecked 和 indeterminate 三种状态。 */
export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-primary-foreground shadow-sm outline-none transition-all duration-200',
        uiStyles.focusBreathingRing,
        'hover:border-primary/70 hover:bg-primary-soft data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary',
        'data-[disabled]:cursor-not-allowed data-[disabled]:border-border data-[disabled]:bg-disabled data-[disabled]:text-disabled-foreground data-[disabled]:opacity-80',
        // 暗黑勾选态用浅蓝底和深色图标，保证在深色表单背景上的可读性。
        'dark:border-border-dark dark:bg-surface-dark dark:text-primary-dark-foreground dark:hover:border-primary-dark/80 dark:hover:bg-primary-dark-soft dark:data-[state=checked]:border-primary-dark dark:data-[state=checked]:bg-primary-dark dark:data-[state=indeterminate]:border-primary-dark dark:data-[state=indeterminate]:bg-primary-dark dark:data-[disabled]:border-border-dark dark:data-[disabled]:bg-disabled-dark dark:data-[disabled]:text-disabled-dark-foreground',
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
  ),
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
