import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockSelectOptions, type MockSelectOptionType } from '../../../utils/mock';
import { uiStyles } from '../shared/styles';

export interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  /** 开启后在未传 children 时自动加载公司业务 mock 选项。 */
  mock?: boolean;
  /** Mock 选项类型，默认展示部门/班级选项。 */
  mockType?: MockSelectOptionType;
  /** Mock 便捷模式下的触发器无障碍名称。 */
  mockAriaLabel?: string;
  /** Mock 便捷模式下的占位文本。 */
  mockPlaceholder?: string;
}

export const Select = ({
  children,
  mock = false,
  mockAriaLabel,
  mockPlaceholder,
  mockType = 'department',
  ...props
}: SelectProps) => {
  const shouldRenderMockOptions = mock && children === undefined;
  const options = shouldRenderMockOptions ? mockSelectOptions(mockType) : [];
  const defaultLabelMap: Record<MockSelectOptionType, string> = {
    department: '选择项目',
    project: '选择项目',
    trainingType: '选择培训类型',
    status: '选择项目状态',
  };
  const defaultLabel = defaultLabelMap[mockType];

  return (
    <SelectPrimitive.Root {...props}>
      {shouldRenderMockOptions ? (
        <>
          <SelectTrigger aria-label={mockAriaLabel ?? defaultLabel}>
            <SelectValue placeholder={mockPlaceholder ?? defaultLabel} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </>
      ) : (
        children
      )}
    </SelectPrimitive.Root>
  );
};

Select.displayName = SelectPrimitive.Root.displayName;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  /** 触发器右侧图标，默认使用 lucide-react 的 ChevronDown。 */
  icon?: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, icon = <ChevronDown />, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex items-center justify-between gap-2 shadow-sm',
      uiStyles.controlBase,
      uiStyles.focusRing,
      uiStyles.controlDisabled,
      'data-[placeholder]:text-muted-foreground dark:data-[placeholder]:text-muted-dark-foreground',
      className,
    )}
    {...props}
  >
    <span className="min-w-0 truncate">{children}</span>
    {icon ? (
      <SelectPrimitive.Icon asChild>
        <span className={uiStyles.mutedIconSlot}>{icon}</span>
      </SelectPrimitive.Icon>
    ) : null}
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(uiStyles.scrollButton, className)}
    {...props}
  >
    <ChevronUp className="size-4" aria-hidden="true" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

export const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(uiStyles.scrollButton, className)}
    {...props}
  >
    <ChevronDown className="size-4" aria-hidden="true" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

export interface SelectContentProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> {
  /** 浮层定位方式，popper 会跟随触发器宽度并处理碰撞。 */
  position?: 'item-aligned' | 'popper';
}

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-80 min-w-36 overflow-hidden',
        uiStyles.floatingSurface,
        uiStyles.floatingStateMotion,
        uiStyles.floatingSideMotion,
        className,
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          // popper 模式下让浮层宽度至少等于触发器，避免选项比输入面窄。
          position === 'popper' && 'min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(uiStyles.sectionLabel, className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      uiStyles.menuItemBase,
      uiStyles.menuItemDefault,
      'w-full pl-9 pr-3',
      className,
    )}
    {...props}
  >
    <span className="absolute left-3 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn(uiStyles.separator, className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
