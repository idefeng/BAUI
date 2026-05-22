import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export const Tabs = TabsPrimitive.Root;

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /** 是否让标签列表撑满父容器宽度，常用于表单或详情页头部。 */
  fullWidth?: boolean;
}

export const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, fullWidth = false, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex h-12 items-center gap-1 rounded-2xl bg-secondary p-1 text-muted-foreground dark:bg-secondary-dark dark:text-muted-dark-foreground',
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  /** 左侧图标，建议传入 lucide-react 图标。 */
  icon?: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, children, icon, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-medium transition-all duration-200',
        'data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-button',
        'data-[state=inactive]:hover:bg-surface/70 data-[state=inactive]:hover:text-foreground',
        uiStyles.radixDisabledItem,
        'dark:data-[state=active]:bg-surface-dark dark:data-[state=active]:text-primary-dark dark:data-[state=inactive]:hover:bg-secondary-dark-hover dark:data-[state=inactive]:hover:text-foreground-dark',
        uiStyles.buttonFocusVisibleRing,
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className={uiStyles.iconSlot} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="truncate">{children}</span>
    </TabsPrimitive.Trigger>
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 rounded-2xl border border-border bg-surface p-5 text-sm leading-6 outline-none dark:border-border-dark dark:bg-surface-dark',
      uiStyles.textForeground,
      uiStyles.focusRing,
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
