import * as React from 'react';
import { AlertTriangle } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { Button, type ButtonVariant } from '../button';
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '../popover';
import { uiStyles } from '../shared/styles';

export type PopconfirmOkVariant = 'primary' | 'danger';

export interface PopconfirmProps {
  /** 触发元素，通常为 Button 或图标按钮。 */
  children: React.ReactNode;
  /** 确认标题。 */
  title: React.ReactNode;
  /** 确认描述。 */
  description?: React.ReactNode;
  /** 确认按钮文案。 */
  okText?: string;
  /** 取消按钮文案。 */
  cancelText?: string;
  /** 确认按钮语义，danger 用于删除/撤销等高风险操作。 */
  okVariant?: PopconfirmOkVariant;
  /** 确认回调。 */
  onConfirm?: () => void;
  /** 取消回调。 */
  onCancel?: () => void;
  /** 受控打开状态。 */
  open?: boolean;
  /** 默认打开状态。 */
  defaultOpen?: boolean;
  /** 打开状态变化回调。 */
  onOpenChange?: (open: boolean) => void;
}

const getOkButtonVariant = (variant: PopconfirmOkVariant): ButtonVariant => (variant === 'danger' ? 'solid' : 'solid');

const getOkButtonClassName = (variant: PopconfirmOkVariant) =>
  variant === 'danger'
    ? 'bg-danger text-danger-foreground hover:bg-danger-hover active:bg-danger-active dark:bg-danger-dark dark:text-danger-dark-foreground dark:hover:bg-danger-dark-hover dark:active:bg-danger-dark-active'
    : undefined;

/** Popconfirm 用于删除、归档、撤销等需要二次确认的轻量浮层。 */
export const Popconfirm = ({
  cancelText = '取消',
  children,
  defaultOpen,
  description,
  okText = '确认',
  okVariant = 'primary',
  onCancel,
  onConfirm,
  onOpenChange,
  open,
  title,
}: PopconfirmProps) => {
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : innerOpen;

  const updateOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInnerOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const handleConfirm = () => {
    onConfirm?.();
    updateOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    updateOpen(false);
  };

  return (
    <Popover open={actualOpen} onOpenChange={updateOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent role="dialog" align="center" className="w-72 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning dark:bg-warning-dark-soft dark:text-warning-dark">
            <AlertTriangle className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className={cn('text-sm font-semibold', uiStyles.textForeground)}>{title}</div>
            {description ? <div className={cn('mt-1 text-sm leading-6', uiStyles.textMuted)}>{description}</div> : null}
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <PopoverClose asChild>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              {cancelText}
            </Button>
          </PopoverClose>
          <Button
            size="sm"
            variant={getOkButtonVariant(okVariant)}
            className={getOkButtonClassName(okVariant)}
            onClick={handleConfirm}
          >
            {okText}
          </Button>
        </div>
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
};

Popconfirm.displayName = 'Popconfirm';
