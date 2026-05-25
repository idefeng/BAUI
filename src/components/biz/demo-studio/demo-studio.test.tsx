import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DemoProvider, DemoPlayer } from './demo-player';

describe('DemoPlayer & Context 引擎测试', () => {
  it('正确解析默认 Manifest 并生成对应的主色调 CSS 变量', () => {
    render(
      <DemoProvider>
        <DemoPlayer />
      </DemoProvider>
    );

    const container = screen.getByTestId('demo-player-container');
    expect(container).toBeInTheDocument();

    // 验证 CSS 变量中注入了推导出的配色
    const styleAttribute = container.getAttribute('style');
    expect(styleAttribute).toContain('--color-primary: #0052D9');
    expect(styleAttribute).toContain('--color-primary-hover:');
    expect(styleAttribute).toContain('--color-primary-soft:');
  });

  it('能成功初始渲染 OTP 免密登录首屏节点，并正常拉起演示控制浮标', () => {
    render(
      <DemoProvider>
        <DemoPlayer />
      </DemoProvider>
    );

    // 验证登录页包含的可见演示要素
    expect(screen.getByText(/登录到个人中心/i)).toBeInTheDocument();
    expect(screen.getByText(/手机号或邮箱/i)).toBeInTheDocument();
    
    // 验证演示控制悬浮浮标已正常挂载
    const floatBtn = screen.getByRole('button', { name: /演示控制面板/i });
    expect(floatBtn).toBeInTheDocument();
  });
});
