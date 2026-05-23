import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerPortal = DialogPrimitive.Portal;
export const DrawerClose = DialogPrimitive.Close;

export interface DrawerOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  /** 测试定位属性，默认用于验证遮罩渲染。 */
  'data-testid'?: string;
}

export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, 'data-testid': dataTestId = 'boao-drawer-overlay', ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-testid={dataTestId}
    className={cn(
      'fixed inset-0 z-50 bg-foreground/35 backdrop-blur-sm dark:bg-background-dark/75',
      'data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out',
      className,
    )}
    {...props}
  />
));

DrawerOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** 抽屉方向，默认右侧滑出。 */
  side?: DrawerSide;
  /** 是否展示右上角关闭按钮。 */
  showClose?: boolean;
}

const sideClasses: Record<DrawerSide, string> = {
  right: 'right-0 top-0 h-full w-[min(28rem,calc(100vw-2rem))] data-[state=open]:animate-select-in',
  left: 'left-0 top-0 h-full w-[min(28rem,calc(100vw-2rem))] data-[state=open]:animate-select-in',
  top: 'left-0 top-0 h-auto max-h-[85vh] w-full data-[state=open]:animate-select-in',
  bottom: 'bottom-0 left-0 h-auto max-h-[85vh] w-full data-[state=open]:animate-select-in',
};

/** DrawerContent 基于 Radix Dialog，负责侧滑浮层、遮罩、关闭按钮和暗黑模式。 */
export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(({ children, className, showClose = true, side = 'right', ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed z-50 flex flex-col gap-5 overflow-y-auto rounded-none border-border bg-surface p-6 text-foreground shadow-2xl outline-none dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark',
        side === 'right' && 'border-l',
        side === 'left' && 'border-r',
        side === 'top' && 'border-b',
        side === 'bottom' && 'border-t',
        sideClasses[side],
        className,
      )}
      {...props}
    >
      {children}
      {showClose ? (
        <DialogPrimitive.Close
          className={cn('absolute right-4 top-4 size-8', uiStyles.closeButton)}
          aria-label="关闭抽屉"
        >
          <X className="size-4" aria-hidden="true" />
        </DialogPrimitive.Close>
      ) : null}
    </DialogPrimitive.Content>
  </DrawerPortal>
));

DrawerContent.displayName = DialogPrimitive.Content.displayName;

export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-2 pr-8 text-left', className)} {...props} />
);

DrawerHeader.displayName = 'DrawerHeader';

export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col-reverse gap-3 border-t border-border pt-4 dark:border-border-dark sm:flex-row sm:justify-end', className)} {...props} />
);

DrawerFooter.displayName = 'DrawerFooter';

export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn(uiStyles.title, 'text-lg', className)} {...props} />
));

DrawerTitle.displayName = DialogPrimitive.Title.displayName;

export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn(uiStyles.description, 'leading-6', className)} {...props} />
));

DrawerDescription.displayName = DialogPrimitive.Description.displayName;
