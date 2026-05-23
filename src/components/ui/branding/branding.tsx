import * as React from 'react';

import { cn } from '../../../lib/utils';

export type BrandLogoVariant = 'full' | 'icon';
export type BrandLogoSize = 'sm' | 'md' | 'lg';

export interface BrandLogoProps extends Omit<React.SVGProps<SVGSVGElement>, 'viewBox'> {
  /** 标识变体：full 用于完整系统字标，icon 用于徽标水印与窄空间。 */
  variant?: BrandLogoVariant;
  /** 预设尺寸，业务侧仍可通过 className 精细覆盖。 */
  size?: BrandLogoSize;
}

export interface BrandBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 背景层默认只做装饰，关闭后可作为可读内容容器使用。 */
  decorative?: boolean;
}

export interface BrandWatermarkProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 水印文案，默认用于企业内部资产防伪提示。 */
  text?: string;
  /** 水印重复次数，Dashboard 等大页面可适当增加密度。 */
  repeat?: number;
}

const brandLabel = '博奥教育 / ETLCHINA 品牌标识';

const fullLogoSizeClassNames: Record<BrandLogoSize, string> = {
  sm: 'h-9 w-[10.5rem]',
  md: 'h-12 w-[13.5rem]',
  lg: 'h-16 w-[18rem]',
};

const iconLogoSizeClassNames: Record<BrandLogoSize, string> = {
  sm: 'size-9',
  md: 'size-12',
  lg: 'size-16',
};

function BrandMark({ className }: { className?: string }) {
  return (
    <g className={cn('text-primary dark:text-primary-dark', className)}>
      <path
        data-slot="brand-mark-shell"
        d="M31.7 5.4a7 7 0 0 1 6.6 0l14.8 8.5a7 7 0 0 1 3.5 6.1v17a9 9 0 0 1-3.8 7.4L36.3 56.2a7.4 7.4 0 0 1-8.6 0L11.2 44.4A9 9 0 0 1 7.4 37V20a7 7 0 0 1 3.5-6.1L25.7 5.4Z"
        fill="currentColor"
      />
      <path
        d="M12.5 18.5a4 4 0 0 1 2-3.5L29.7 6.4a6 6 0 0 1 5.8 0l14.4 8.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.4"
        opacity="0.22"
      />
      <text
        x="31"
        y="39.5"
        className="text-background dark:text-background-dark"
        fill="currentColor"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontSize="24"
        fontWeight="900"
        letterSpacing="0"
        textAnchor="middle"
      >
        ET
      </text>
      <g data-slot="brand-mark-accent" className="text-success dark:text-success-dark">
        <path d="M37 49.5 48.2 31.5 57 45.8h-7l-2.2-3.8-4.8 7.5Z" fill="currentColor" opacity="0.95" />
        <path d="M49.5 49.5h6.7l-3.3 4.6a8.5 8.5 0 0 1-5.8 3.4Z" fill="currentColor" opacity="0.75" />
      </g>
    </g>
  );
}

/** BrandLogo 是 ETLCHINA UI 的中央企业标识，所有页面入口和水印统一复用它。 */
export function BrandLogo({
  className,
  size = 'md',
  variant = 'full',
  ...props
}: BrandLogoProps) {
  const isIcon = variant === 'icon';

  if (isIcon) {
    return (
      <svg
        role="img"
        aria-label={brandLabel}
        viewBox="0 0 64 64"
        className={cn('shrink-0 text-primary dark:text-primary-dark', iconLogoSizeClassNames[size], className)}
        {...props}
      >
        <BrandMark className="text-current" />
      </svg>
    );
  }

  return (
    <svg
      role="img"
      aria-label={brandLabel}
      viewBox="0 0 240 64"
      className={cn('shrink-0 text-slate-900 dark:text-white', fullLogoSizeClassNames[size], className)}
      {...props}
    >
      <BrandMark />
      <g className="text-current">
        <text x="76" y="29" fill="currentColor" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="20" fontWeight="800" letterSpacing="0">
          博奥教育
        </text>
        <text x="76" y="48" fill="currentColor" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontSize="11" fontWeight="700" letterSpacing="0">
          ETLCHINA
        </text>
        <path d="M76 36h126" stroke="currentColor" strokeWidth="1.5" opacity="0.16" />
      </g>
    </svg>
  );
}

/** BrandBackground 提供品牌科技感底纹，适合登录页左屏、大屏背景和 Storybook 展示容器。 */
export function BrandBackground({
  className,
  decorative = true,
  ...props
}: BrandBackgroundProps) {
  return (
    <div
      aria-hidden={decorative ? 'true' : undefined}
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-br from-background via-primary-soft/40 to-success-soft/30 text-primary/15 before:absolute before:left-1/2 before:top-1/4 before:size-80 before:-translate-x-1/2 before:rounded-full before:bg-primary/20 before:blur-3xl before:content-[""] after:absolute after:bottom-6 after:right-8 after:size-72 after:rounded-full after:bg-success/20 after:blur-3xl after:content-[""] dark:from-background-dark dark:via-primary-dark-soft/20 dark:to-success-dark-soft/10 dark:text-primary-dark/20 dark:before:bg-primary-dark/20 dark:after:bg-success-dark/15 [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:24px_24px]',
        className,
      )}
      {...props}
    />
  );
}

/** BrandWatermark 用于内部资产防伪提示，默认不拦截鼠标事件。 */
export function BrandWatermark({
  className,
  repeat = 16,
  text = 'ETLCHINA 内部资产',
  ...props
}: BrandWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 z-10 grid grid-cols-2 gap-x-16 gap-y-10 overflow-hidden p-8 text-primary/50 opacity-[0.07] dark:text-primary-dark/70 dark:opacity-[0.12] md:grid-cols-3 xl:grid-cols-4',
        className,
      )}
      {...props}
    >
      {Array.from({ length: repeat }, (_, index) => (
        <div
          key={index}
          className="-rotate-12 select-none whitespace-nowrap text-xs font-semibold tracking-[0.24em]"
        >
          <span className="inline-flex items-center gap-3">
            <BrandLogo variant="icon" size="sm" className="size-5 opacity-75" aria-hidden="true" />
            <span>{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
