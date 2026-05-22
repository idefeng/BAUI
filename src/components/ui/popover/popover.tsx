import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type PopoverTriggerMode = 'click' | 'hover';

export interface PopoverProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root> {
  /** 触发方式，click 保留 Radix 默认交互，hover 适合头像学习档案预览。 */
  triggerMode?: PopoverTriggerMode;
  /** hover 打开延迟，避免鼠标经过时误触。 */
  hoverOpenDelay?: number;
  /** hover 关闭延迟，便于从触发器移动到浮层。 */
  hoverCloseDelay?: number;
}

interface PopoverContextValue {
  triggerMode: PopoverTriggerMode;
  setHoverOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextValue>({
  triggerMode: 'click',
  setHoverOpen: () => undefined,
});

export const Popover = ({
  defaultOpen,
  hoverCloseDelay = 120,
  hoverOpenDelay = 80,
  onOpenChange,
  open,
  triggerMode = 'click',
  ...props
}: PopoverProps) => {
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen ?? false);
  const timerRef = React.useRef<number>();
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : innerOpen;

  const updateOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInnerOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const setHoverOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (triggerMode !== 'hover') {
        return;
      }

      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(
        () => updateOpen(nextOpen),
        nextOpen ? hoverOpenDelay : hoverCloseDelay,
      );
    },
    [hoverCloseDelay, hoverOpenDelay, triggerMode, updateOpen],
  );

  React.useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (
    <PopoverContext.Provider value={{ triggerMode, setHoverOpen }}>
      <PopoverPrimitive.Root open={actualOpen} onOpenChange={updateOpen} {...props} />
    </PopoverContext.Provider>
  );
};

export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ onMouseEnter, onMouseLeave, ...props }, ref) => {
  const { setHoverOpen, triggerMode } = React.useContext(PopoverContext);

  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (triggerMode === 'hover') {
          setHoverOpen(true);
        }
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        if (triggerMode === 'hover') {
          setHoverOpen(false);
        }
      }}
      {...props}
    />
  );
});

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /** 测试定位属性，默认用于验证浮层样式。 */
  'data-testid'?: string;
}

export const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(({ align = 'center', children, className, onMouseEnter, onMouseLeave, sideOffset = 10, 'data-testid': dataTestId = 'boao-popover-content', ...props }, ref) => {
  const { setHoverOpen, triggerMode } = React.useContext(PopoverContext);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        data-testid={dataTestId}
        onMouseEnter={(event) => {
          onMouseEnter?.(event);
          if (triggerMode === 'hover') {
            setHoverOpen(true);
          }
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
          if (triggerMode === 'hover') {
            setHoverOpen(false);
          }
        }}
        className={cn(
          'z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl p-4 text-sm text-foreground outline-none dark:text-foreground-dark',
          uiStyles.surfaceCard,
          'shadow-tooltip',
          uiStyles.floatingStateMotion,
          uiStyles.floatingSideMotion,
          className,
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn('fill-surface drop-shadow-sm dark:fill-surface-dark', className)}
    {...props}
  />
));

PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName;
