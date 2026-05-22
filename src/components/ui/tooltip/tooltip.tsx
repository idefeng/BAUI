import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

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
        'z-50 max-w-72 rounded-2xl px-3.5 py-2 text-sm leading-5 text-foreground outline-none dark:text-foreground-dark',
        uiStyles.surfaceCard,
        'shadow-tooltip',
        uiStyles.floatingDelayedStateMotion,
        uiStyles.floatingSideMotion,
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;
