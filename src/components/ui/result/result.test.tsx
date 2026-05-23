import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Result } from './result';

describe('Result', () => {
  it('渲染成功结果页和操作区', () => {
    render(<Result status="success" title="提交成功" subTitle="资料已进入审核队列。" extra={<button type="button">返回列表</button>} />);

    expect(screen.getByText('提交成功')).toHaveClass('text-foreground');
    expect(screen.getByText('资料已进入审核队列。')).toHaveClass('text-muted-foreground');
    expect(screen.getByRole('button', { name: '返回列表' })).toBeInTheDocument();
  });

  it('error 状态使用危险色视觉', () => {
    render(<Result status="error" title="提交失败" />);

    expect(screen.getByTestId('boao-result-icon')).toHaveClass('text-danger');
  });
});
