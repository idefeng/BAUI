import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Slider } from './slider';

describe('Slider', () => {
  it('支持单滑块受控值，并按 step 回传 number', () => {
    const onChange = vi.fn();

    render(<Slider aria-label="预算比例" min={0} max={100} step={5} value={40} onChange={onChange} />);

    const thumb = screen.getByRole('slider', { name: '预算比例' });

    expect(thumb).toHaveAttribute('aria-valuenow', '40');

    thumb.focus();
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });

    expect(onChange).toHaveBeenCalledWith(45);
  });

  it('支持范围双滑块，并按 tuple 回传完整范围', () => {
    const onChange = vi.fn();

    render(<Slider aria-label="薪资范围" min={0} max={100} step={10} value={[20, 80]} onChange={onChange} />);

    const [minThumb, maxThumb] = screen.getAllByRole('slider');

    expect(minThumb).toHaveAttribute('aria-valuenow', '20');
    expect(maxThumb).toHaveAttribute('aria-valuenow', '80');

    minThumb.focus();
    fireEvent.keyDown(minThumb, { key: 'ArrowRight' });

    expect(onChange).toHaveBeenCalledWith([30, 80]);
  });

  it('拖拽手柄时显示当前数值气泡', () => {
    render(<Slider aria-label="完成进度" value={60} onChange={() => undefined} />);

    const thumb = screen.getByRole('slider', { name: '完成进度' });

    expect(screen.queryByText('60')).not.toBeInTheDocument();

    fireEvent.pointerDown(thumb);

    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('包含品牌科技蓝轨道和暗黑模式样式', () => {
    render(<Slider aria-label="满意度" value={80} onChange={() => undefined} />);

    expect(screen.getByTestId('slider-root').className).toContain('dark:');
    expect(screen.getByTestId('slider-range').className).toContain('bg-primary');
  });
});
