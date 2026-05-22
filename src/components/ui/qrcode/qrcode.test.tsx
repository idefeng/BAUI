import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { QRCode } from './qrcode';

describe('QRCode', () => {
  it('渲染白底圆角二维码卡片', () => {
    render(<QRCode value="https://boao.example.com/sign/2026" />);

    expect(screen.getByTestId('boao-qrcode')).toHaveClass('rounded-2xl');
    expect(screen.getByTestId('boao-qrcode')).toHaveClass('bg-surface');
  });

  it('支持中心 icon 覆盖层', () => {
    render(<QRCode value="https://boao.example.com/cert/001" icon={<span>BO</span>} />);

    expect(screen.getByText('BO').closest('[data-slot="qrcode-icon"]')).toHaveClass('rounded-xl');
  });

  it('过期状态展示遮罩和刷新提示', () => {
    render(<QRCode value="expired" status="expired" />);

    expect(screen.getByText('二维码已失效，点击刷新')).toHaveClass('bg-surface/90');
  });

  it('loading 状态展示二维码骨架屏', () => {
    render(<QRCode value="loading" status="loading" />);

    expect(screen.getByTestId('boao-qrcode-loading')).toBeInTheDocument();
  });
});
