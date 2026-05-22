import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-colors dark:border-border-dark dark:bg-surface-dark',
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = AccordionPrimitive.Item.displayName;

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  /** 右侧展开图标，默认使用 lucide-react 的 ChevronDown。 */
  icon?: React.ReactNode;
  /** 是否隐藏右侧展开图标。 */
  hideIcon?: boolean;
}

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, hideIcon = false, icon = <ChevronDown />, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left text-sm font-semibold text-foreground transition-colors',
        uiStyles.primarySurfaceHover,
        'data-[state=open]:text-primary',
        'disabled:pointer-events-none disabled:opacity-50',
        'dark:text-foreground-dark dark:data-[state=open]:text-primary-dark',
        uiStyles.buttonFocusVisibleRing,
        className,
      )}
      {...props}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {hideIcon ? null : (
        <span
          className={cn(
            'inline-flex size-5 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 dark:text-muted-dark-foreground',
            '[&>svg]:size-4',
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden px-5 pb-5 pt-0 text-sm leading-6 text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down dark:text-muted-dark-foreground',
      className,
    )}
    {...props}
  />
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
