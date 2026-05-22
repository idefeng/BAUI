import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastProviderProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Provider> {
  /** Toast 自动关闭时长，默认 5000 毫秒。 */
  duration?: number;
}

export const ToastProvider = ({ duration = 5000, ...props }: ToastProviderProps) => (
  <ToastPrimitive.Provider duration={duration} {...props} />
);

const variantClasses: Record<ToastVariant, string> = {
  success: cn('border-success bg-success-soft dark:border-success-dark dark:bg-success-dark-soft', uiStyles.textForeground),
  error: cn('border-danger bg-danger-soft dark:border-danger-dark dark:bg-danger-dark-soft', uiStyles.textForeground),
  info: cn('border-primary bg-primary-soft dark:border-primary-dark dark:bg-primary-dark-soft', uiStyles.textForeground),
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="size-5 text-success dark:text-success-dark" aria-hidden="true" />,
  error: <AlertCircle className="size-5 text-danger dark:text-danger-dark" aria-hidden="true" />,
  info: <Info className="size-5 text-primary dark:text-primary-dark" aria-hidden="true" />,
};

export interface ToastRootProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> {
  /** 通知状态，决定图标和语义色。 */
  variant?: ToastVariant;
  /** 是否隐藏左侧状态图标。 */
  hideIcon?: boolean;
  /** Toast 自动关闭时长，默认 5000 毫秒。 */
  duration?: number;
}

export const ToastRoot = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, ToastRootProps>(
  ({ className, children, duration = 5000, hideIcon = false, variant = 'info', ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      role="status"
      aria-live="polite"
      duration={duration}
      data-duration={duration}
      className={cn(
        'grid w-full grid-cols-[auto_1fr_auto] items-start gap-3 p-4 outline-none',
        uiStyles.floatingSurface,
        'data-[state=open]:animate-toast-in data-[state=closed]:animate-toast-out',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {hideIcon ? null : <span className="mt-0.5 inline-flex size-5 items-center justify-center">{variantIcons[variant]}</span>}
      <div className={cn('min-w-0 space-y-1', hideIcon && 'col-start-1')}>{children}</div>
      <ToastPrimitive.Close
        className={cn('size-7', uiStyles.closeButton)}
        aria-label="关闭通知"
      >
        <X className="size-3.5" aria-hidden="true" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  ),
);
ToastRoot.displayName = ToastPrimitive.Root.displayName;

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn(uiStyles.title, className)} {...props} />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn(uiStyles.description, 'leading-5', className)} {...props} />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

export const ToastAction = ToastPrimitive.Action;
export const ToastClose = ToastPrimitive.Close;

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn('fixed right-6 top-6 z-50 flex w-96 max-w-[calc(100vw-3rem)] flex-col gap-3 outline-none', className)}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

export interface ToastItem {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastHostProps extends ToastProviderProps {
  /** 当前全局通知队列，通常由业务层或 useToast 管理。 */
  toasts: ToastItem[];
  /** 通知关闭后的回调，用于从队列中移除。 */
  onRemove: (id: string) => void;
}

export const ToastHost = ({ children, duration = 5000, onRemove, toasts, ...props }: ToastHostProps) => (
  <ToastProvider duration={duration} {...props}>
    {children}
    {toasts.map((toast) => (
      <ToastRoot
        key={toast.id}
        open
        variant={toast.variant}
        duration={toast.duration ?? duration}
        onOpenChange={(open) => {
          if (!open) {
            onRemove(toast.id);
          }
        }}
      >
        <ToastTitle>{toast.title}</ToastTitle>
        {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
      </ToastRoot>
    ))}
    <ToastViewport />
  </ToastProvider>
);

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const showToast = React.useCallback((toast: Omit<ToastItem, 'id'>) => {
    // 使用浏览器随机 ID 避免业务层手动管理通知 key。
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { ...toast, id }]);
    return id;
  }, []);

  return {
    removeToast,
    showToast,
    toasts,
  };
};
