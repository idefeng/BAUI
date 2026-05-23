import * as React from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { uiStyles } from '../shared/styles';

export type TitleLevel = 1 | 2 | 3 | 4 | 5;
export type TextType = 'default' | 'secondary' | 'success' | 'warning' | 'danger';
export type TextSize = 'sm' | 'md' | 'lg';

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 标题层级，会映射到 h1-h5 的语义标签。 */
  level?: TitleLevel;
}

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 文本语义类型，danger/warning/success 用于业务状态提示。 */
  type?: TextType;
  /** 是否展示弱化文本，优先级高于 type。 */
  muted?: boolean;
  /** 是否使用加粗强调。 */
  strong?: boolean;
  /** 是否使用斜体。 */
  italic?: boolean;
  /** 是否展示下划线。 */
  underline?: boolean;
  /** 是否展示删除线。 */
  delete?: boolean;
  /** 文本尺寸，默认 md。 */
  size?: TextSize;
}

export interface ParagraphEllipsis {
  /** 最大展示行数，超出后用 line-clamp 收起。 */
  rows?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** 段落语义类型，沿用 Text 的状态色。 */
  type?: TextType;
  /** 是否展示弱化文本。 */
  muted?: boolean;
  /** 是否启用复制按钮。 */
  copyable?: boolean;
  /** 多行省略配置。 */
  ellipsis?: boolean | ParagraphEllipsis;
}

const titleClasses: Record<TitleLevel, string> = {
  1: 'text-3xl font-semibold leading-tight',
  2: 'text-2xl font-semibold leading-tight',
  3: 'text-xl font-semibold leading-snug',
  4: 'text-lg font-semibold leading-snug',
  5: 'text-base font-semibold leading-snug',
};

const titleTagMap: Record<TitleLevel, 'h1' | 'h2' | 'h3' | 'h4' | 'h5'> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
};

const textTypeClasses: Record<TextType, string> = {
  default: uiStyles.textForeground,
  secondary: uiStyles.textMuted,
  success: 'text-success dark:text-success-dark',
  warning: 'text-warning dark:text-warning-dark',
  danger: 'text-danger dark:text-danger-dark',
};

const textSizeClasses: Record<TextSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const lineClampClasses: Record<NonNullable<ParagraphEllipsis['rows']>, string> = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

const getParagraphText = (children: React.ReactNode) =>
  React.Children.toArray(children)
    .map((child) => (typeof child === 'string' || typeof child === 'number' ? String(child) : ''))
    .join('');

/** Title 提供 Ant Typography.Title 对应的轻量语义标题。 */
export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, level = 1, ...props }, ref) => {
    // 使用 createElement 避免 JSX 动态标签在 TS 中生成过大的 IntrinsicElements 联合类型。
    return React.createElement(titleTagMap[level], {
      ...props,
      ref,
      className: cn('m-0 tracking-normal', uiStyles.textForeground, titleClasses[level], className),
    });
  },
);

Title.displayName = 'Title';

/** Text 提供常用行内文本状态，保持纯 UI 渲染。 */
export const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      className,
      delete: deleted = false,
      italic = false,
      muted = false,
      size = 'md',
      strong = false,
      type = 'default',
      underline = false,
      ...props
    },
    ref,
  ) => (
    <span
      ref={ref}
      className={cn(
        textSizeClasses[size],
        muted ? uiStyles.textMuted : textTypeClasses[type],
        strong && 'font-semibold',
        italic && 'italic',
        underline && 'underline underline-offset-4',
        deleted && 'line-through',
        className,
      )}
      {...props}
    />
  ),
);

Text.displayName = 'Text';

/** Paragraph 提供段落、复制和多行省略能力，适合说明文本和详情摘要。 */
export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ children, className, copyable = false, ellipsis = false, muted = false, type = 'default', ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);
    const ellipsisRows = typeof ellipsis === 'object' ? ellipsis.rows ?? 3 : ellipsis ? 3 : undefined;

    const handleCopy = async () => {
      const text = getParagraphText(children);

      if (navigator.clipboard && text) {
        await navigator.clipboard.writeText(text);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    };

    return (
      <div className="group flex items-start gap-2">
        <p
          ref={ref}
          className={cn(
            'm-0 text-sm leading-6',
            muted ? uiStyles.textMuted : textTypeClasses[type],
            ellipsisRows && lineClampClasses[ellipsisRows],
            className,
          )}
          {...props}
        >
          {children}
        </p>
        {copyable ? (
          <button
            type="button"
            aria-label="复制文本"
            className={cn('mt-0.5 size-7', uiStyles.iconGhostButton)}
            onClick={handleCopy}
          >
            {copied ? <Check className="size-4 text-success" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          </button>
        ) : null}
      </div>
    );
  },
);

Paragraph.displayName = 'Paragraph';
