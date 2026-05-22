import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Carousel } from './carousel';

const slides = [
  { id: 'banner-1', title: '食品安全管理员', description: '扫码签到与证书同步', image: 'https://example.com/banner-1.png' },
  { id: 'banner-2', title: '继续医学教育', description: '课程提醒与学时追踪', image: 'https://example.com/banner-2.png' },
  { id: 'banner-3', title: '睡眠技师训练营', description: '学习进度实时看板', image: 'https://example.com/banner-3.png' },
];

describe('Carousel', () => {
  it('默认展示第一张轮播并渲染胶囊型指示点', () => {
    render(<Carousel slides={slides} />);

    expect(screen.getByText('食品安全管理员')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '切换到第 1 张' })).toHaveClass('w-8');
    expect(screen.getByRole('tab', { name: '切换到第 2 张' })).toHaveClass('w-2.5');
  });

  it('点击下一张按钮后切换激活内容', async () => {
    const user = userEvent.setup();

    render(<Carousel slides={slides} />);
    await user.click(screen.getByRole('button', { name: '下一张' }));

    expect(screen.getByText('继续医学教育')).toBeInTheDocument();
  });

  it('autoplay 开启后按间隔自动切换', () => {
    vi.useFakeTimers();

    render(<Carousel slides={slides} autoplay interval={1200} />);
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByText('继续医学教育')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
