import * as React from 'react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export interface AppProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 应用标题，通常是后台系统或业务工作台名称。 */
  title?: React.ReactNode;
  /** 左侧或顶部导航内容。 */
  navigation?: React.ReactNode;
  /** 顶栏右侧操作区。 */
  actions?: React.ReactNode;
}

export const App = React.forwardRef<HTMLDivElement, AppProps>(
  ({ actions, children, className, navigation, title, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cn('min-h-screen bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark', className)}
    >
      <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border px-6 dark:border-border-dark">
        <div>
          {title ? <h1 className="text-lg font-semibold">{title}</h1> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {navigation ? (
          <aside className={cn('w-64 shrink-0 border-r border-border p-4 dark:border-border-dark', uiStyles.textForeground)}>
            {navigation}
          </aside>
        ) : null}
        <div className="min-w-0 flex-1 p-6">{children}</div>
      </div>
    </div>
  ),
);

App.displayName = 'App';
