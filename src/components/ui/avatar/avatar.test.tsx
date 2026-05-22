import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './avatar';

describe('Avatar', () => {
  it('没有图片时展示姓名首字母并按名称生成低饱和背景', () => {
    render(<Avatar name="林予安" alt="林予安头像" />);

    const fallback = screen.getByText('安');

    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveClass('bg-[hsl(var(--boao-avatar-hue)_42%_88%)]');
  });

  it('支持不同尺寸并保留圆形头像样式', () => {
    render(<Avatar name="周明轩" size="lg" />);

    expect(screen.getByText('轩').closest('[data-slot="avatar"]')).toHaveClass('size-14');
    expect(screen.getByText('轩').closest('[data-slot="avatar"]')).toHaveClass('rounded-full');
  });

  it('mock 开启且未传图片时自动使用中心 mock 用户头像和姓名兜底', () => {
    render(<Avatar mock alt="mock 学员头像" />);

    expect(screen.getByText('安')).toBeInTheDocument();
  });
});
