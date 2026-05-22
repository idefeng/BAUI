import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '../../../lib/utils';
import { mockUsers } from '../../../utils/mock';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>, 'children'> {
  /** 头像图片地址；传入真实图片时优先展示图片。 */
  src?: string;
  /** 图片替代文本，未传时会根据 name 自动生成。 */
  alt?: string;
  /** 用户姓名，用于生成失败兜底文字和稳定背景色。 */
  name?: string;
  /** 头像尺寸，默认 md。 */
  size?: AvatarSize;
  /** 启用中心 mock 用户数据；只有外部未传 src/name 时才会兜底接管。 */
  mock?: boolean;
  /** 自定义兜底内容，适合业务传入简称或图标。 */
  fallback?: React.ReactNode;
  /** 透传给 Radix AvatarImage 的属性。 */
  imageProps?: Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>, 'src' | 'alt'>;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-base',
};

const getNameHashHue = (name: string) =>
  Array.from(name).reduce((hash, char) => hash + char.charCodeAt(0), 0) % 360;

const getAvatarInitial = (name: string) => {
  const normalizedName = name.trim();

  if (!normalizedName) {
    return '?';
  }

  // 中文姓名通常以最后一个字作为更自然的头像简称。
  if (/[\u4E00-\u9FFF]/.test(normalizedName)) {
    return Array.from(normalizedName).slice(-1)[0];
  }

  const words = normalizedName.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  }

  return normalizedName.slice(0, 2).toUpperCase();
};

/** Avatar 基于 Radix Avatar 封装图片、失败兜底和 mock 学员头像能力。 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ alt, className, fallback, imageProps, mock = false, name, size = 'md', src, ...props }, ref) => {
    const mockUser = React.useMemo(() => (mock ? mockUsers(1)[0] : undefined), [mock]);
    const displayName = name ?? mockUser?.name ?? alt ?? '学员';
    const imageSrc = src ?? (src === undefined ? mockUser?.avatarUrl : undefined);
    const imageAlt = alt ?? `${displayName}头像`;
    const fallbackStyle = {
      '--boao-avatar-hue': String(getNameHashHue(displayName)),
    } as React.CSSProperties;

    return (
      <AvatarPrimitive.Root
        ref={ref}
        data-slot="avatar"
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted align-middle font-semibold shadow-sm dark:border-border-dark dark:bg-muted-dark',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {imageSrc ? (
          <AvatarPrimitive.Image
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full rounded-full object-cover"
            {...imageProps}
          />
        ) : null}
        <AvatarPrimitive.Fallback
          style={fallbackStyle}
          className={cn(
            'flex h-full w-full items-center justify-center rounded-full',
            'bg-[hsl(var(--boao-avatar-hue)_42%_88%)] text-[hsl(var(--boao-avatar-hue)_58%_30%)]',
            'dark:bg-[hsl(var(--boao-avatar-hue)_42%_28%)] dark:text-[hsl(var(--boao-avatar-hue)_80%_84%)]',
          )}
        >
          {fallback ?? getAvatarInitial(displayName)}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  },
);

Avatar.displayName = 'Avatar';
