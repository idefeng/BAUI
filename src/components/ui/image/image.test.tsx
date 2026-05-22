import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Image } from './image';

describe('Image', () => {
  it('图片加载完成前展示 Skeleton 骨架屏', () => {
    render(<Image src="https://example.com/course.png" alt="课程海报" />);

    expect(screen.getByTestId('boao-image-skeleton')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '课程海报' })).toHaveAttribute('loading', 'lazy');
  });

  it('加载失败时展示优雅断网占位图', () => {
    render(<Image src="https://example.com/missing.png" alt="缺失图片" />);

    fireEvent.error(screen.getByRole('img', { name: '缺失图片' }));

    expect(screen.getByText('图片去外星了')).toBeInTheDocument();
  });

  it('preview 开启后点击图片通过弹窗查看大图', async () => {
    const user = userEvent.setup();

    render(<Image src="https://example.com/course.png" alt="可预览海报" preview />);
    fireEvent.load(screen.getByRole('img', { name: '可预览海报' }));
    await user.click(screen.getByRole('button', { name: '预览 可预览海报' }));

    expect(screen.getByRole('dialog', { name: '可预览海报' })).toBeInTheDocument();
  });
});
