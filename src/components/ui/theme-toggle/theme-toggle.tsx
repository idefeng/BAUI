import * as React from 'react';
import { Moon, Sun } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type ThemeMode = 'light' | 'dark';

export interface ThemeToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** 当前主题；传入后组件进入受控模式，由外部负责保存主题状态。 */
  theme?: ThemeMode;
  /** 非受控模式下的默认主题，未命中本地记录时生效。 */
  defaultTheme?: ThemeMode;
  /** 主题切换后的回调，适合同步到业务侧偏好设置。 */
  onThemeChange?: (theme: ThemeMode) => void;
  /** localStorage 中保存主题的键名。 */
  storageKey?: string;
  /** 是否将主题写入 localStorage，默认开启。 */
  persist?: boolean;
  /** 图标下方是否展示文字标签。 */
  showLabel?: boolean;
}

const DEFAULT_STORAGE_KEY = 'boao-ui-theme';

const isThemeMode = (value: string | null): value is ThemeMode => value === 'light' || value === 'dark';

const getStoredTheme = (storageKey: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storage = window.localStorage;

  if (typeof storage?.getItem !== 'function') {
    return null;
  }

  try {
    return storage.getItem(storageKey);
  } catch {
    return null;
  }
};

const applyDocumentTheme = (theme: ThemeMode, storageKey: string, persist: boolean) => {
  if (typeof document === 'undefined') {
    return;
  }

  // Storybook 与业务项目都通过 html.dark 控制 Tailwind 暗黑模式。
  document.documentElement.classList.toggle('dark', theme === 'dark');

  if (persist && typeof window !== 'undefined' && typeof window.localStorage?.setItem === 'function') {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // 隐私模式或嵌入式预览禁用存储时，主题切换仍然应当可用。
    }
  }
};

const resolveInitialTheme = (storageKey: string, defaultTheme: ThemeMode) => {
  const storedTheme = getStoredTheme(storageKey);

  if (isThemeMode(storedTheme)) {
    return storedTheme;
  }

  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }

  return defaultTheme;
};

export const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  (
    {
      className,
      defaultTheme = 'light',
      disabled = false,
      onClick,
      onThemeChange,
      persist = true,
      showLabel = false,
      storageKey = DEFAULT_STORAGE_KEY,
      theme,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const isControlled = theme !== undefined;
    const [internalTheme, setInternalTheme] = React.useState<ThemeMode>(() =>
      resolveInitialTheme(storageKey, defaultTheme),
    );
    const currentTheme = theme ?? internalTheme;
    const isDark = currentTheme === 'dark';
    const nextTheme: ThemeMode = isDark ? 'light' : 'dark';
    const label = isDark ? '切换到亮色模式' : '切换到暗色模式';

    React.useEffect(() => {
      applyDocumentTheme(currentTheme, storageKey, persist);
    }, [currentTheme, persist, storageKey]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      // 先同步 DOM，再更新 React 状态，避免 Storybook 预览区出现切换延迟。
      applyDocumentTheme(nextTheme, storageKey, persist);

      if (!isControlled) {
        setInternalTheme(nextTheme);
      }

      onThemeChange?.(nextTheme);
    };

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        aria-label={label}
        aria-pressed={isDark}
        disabled={disabled}
        data-theme={currentTheme}
        onClick={handleClick}
        className={cn(
          'group inline-flex h-11 items-center gap-3 rounded-2xl border border-border bg-surface px-3 text-sm font-medium text-foreground shadow-button transition-all duration-200',
          'hover:border-primary hover:bg-primary-soft hover:text-primary active:scale-[0.98]',
          'disabled:pointer-events-none disabled:bg-disabled disabled:text-disabled-foreground disabled:shadow-none',
          'dark:border-border-dark dark:bg-surface-dark dark:text-foreground-dark dark:hover:border-primary-dark dark:hover:bg-primary-dark-soft dark:hover:text-primary-dark dark:disabled:bg-disabled-dark dark:disabled:text-disabled-dark-foreground',
          uiStyles.buttonFocusVisibleRing,
          className,
        )}
      >
        <span className="relative inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-muted-foreground transition-colors dark:bg-secondary-dark dark:text-muted-dark-foreground">
          <Sun
            className={cn(
              'absolute size-4 transition-all duration-200',
              isDark ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
            )}
            aria-hidden="true"
          />
          <Moon
            className={cn(
              'absolute size-4 transition-all duration-200',
              isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0',
            )}
            aria-hidden="true"
          />
        </span>
        {showLabel ? <span>{isDark ? '暗色模式' : '亮色模式'}</span> : null}
      </button>
    );
  },
);

ThemeToggle.displayName = 'ThemeToggle';
