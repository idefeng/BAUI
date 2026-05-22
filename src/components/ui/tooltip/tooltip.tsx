import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../../../lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {}

/** Tooltip 提示弹窗，基于 Radix 保留 hover、focus 和键盘可访问性。 */
export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 max-w-72 rounded-2xl border border-border bg-surface px-3.5 py-2 text-sm leading-5 text-foreground shadow-tooltip outline-none',
        'data-[state=delayed-open]:animate-select-in data-[state=closed]:animate-select-out',
        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        // 暗黑模式下保留边框和阴影层次，避免提示浮层贴在深色背景里。
        'dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;
