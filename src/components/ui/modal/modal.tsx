import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalPortal = DialogPrimitive.Portal;
export const ModalClose = DialogPrimitive.Close;

export interface ModalOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {
  /** 测试定位属性，默认用于验证遮罩渲染。 */
  'data-testid'?: string;
}

export const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
>(({ className, 'data-testid': dataTestId = 'boao-modal-overlay', ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-testid={dataTestId}
    className={cn(
      'fixed inset-0 z-50 bg-foreground/45 backdrop-blur-sm dark:bg-background-dark/75',
      'data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out',
      className,
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

export interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** 是否展示右上角关闭按钮。 */
  showClose?: boolean;
}

export const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, showClose = true, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg gap-5 p-6 outline-none',
        uiStyles.floatingSurface,
        'data-[state=open]:animate-modal-in data-[state=closed]:animate-modal-out',
        className,
      )}
      {...props}
    >
      {children}
      {showClose ? (
        <DialogPrimitive.Close
          className={cn('absolute right-4 top-4 size-8', uiStyles.closeButton)}
          aria-label="关闭弹窗"
        >
          <X className="size-4" aria-hidden="true" />
        </DialogPrimitive.Close>
      ) : null}
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

export const ModalHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-2 pr-8 text-left', className)} {...props} />
);
ModalHeader.displayName = 'ModalHeader';

export const ModalFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse gap-3 sm:flex-row sm:justify-end', className)} {...props} />
);
ModalFooter.displayName = 'ModalFooter';

export const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn(uiStyles.title, 'text-lg', className)} {...props} />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

export const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn(uiStyles.description, 'leading-6', className)} {...props} />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;
