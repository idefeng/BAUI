import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 开启后卡片在悬浮时轻微上浮，适合可点击入口卡片。 */
  hoverable?: boolean;
}

/** Card 是 ETLCHINA UI 的基础布局容器，默认包含边框、柔和阴影和暗黑分层。 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(
        uiStyles.panelSurface,
        hoverable && 'transition-all duration-200 hover:-translate-y-1 hover:shadow-md',
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 p-6 pb-4', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn(uiStyles.title, 'text-base leading-6', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(uiStyles.description, 'leading-6', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('px-6 py-4', className)} {...props} />,
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(uiStyles.cardFooter, className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter';
