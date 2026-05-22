import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

/** RadioGroup 表单原子组件，负责管理单选值和键盘导航。 */
export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2', className)} {...props} />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {}

/** RadioGroupItem 单选项，内置选中指示点、禁用态和 focus 呼吸环。 */
export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-sm outline-none transition-all duration-200',
      uiStyles.focusBreathingRing,
      'hover:border-primary/70 hover:bg-primary-soft data-[state=checked]:border-primary data-[state=checked]:bg-primary-soft',
      'data-[disabled]:cursor-not-allowed data-[disabled]:border-border data-[disabled]:bg-disabled data-[disabled]:text-disabled-foreground data-[disabled]:opacity-80',
      // 暗黑选中态保持浅蓝描边和圆点，在深色背景下比纯灰态更清晰。
      'dark:border-border-dark dark:bg-surface-dark dark:text-primary-dark dark:hover:border-primary-dark/80 dark:hover:bg-primary-dark-soft dark:data-[state=checked]:border-primary-dark dark:data-[state=checked]:bg-primary-dark-soft dark:data-[disabled]:border-border-dark dark:data-[disabled]:bg-disabled-dark dark:data-[disabled]:text-disabled-dark-foreground',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="size-2 rounded-full bg-current" aria-hidden="true" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
