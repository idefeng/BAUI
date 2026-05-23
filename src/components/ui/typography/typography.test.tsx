import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Paragraph, Text, Title } from './typography';

describe('Typography', () => {
  it('Title 按 level 渲染语义标题并应用前景色', () => {
    render(<Title level={2}>培训项目总览</Title>);

    expect(screen.getByRole('heading', { level: 2, name: '培训项目总览' })).toHaveClass('text-foreground');
  });

  it('Text 支持强调、弱化和 danger 语义', () => {
    const { rerender } = render(<Text strong>核心指标</Text>);
    expect(screen.getByText('核心指标')).toHaveClass('font-semibold');

    rerender(<Text muted>辅助说明</Text>);
    expect(screen.getByText('辅助说明')).toHaveClass('text-muted-foreground');

    rerender(<Text type="danger">异常任务</Text>);
    expect(screen.getByText('异常任务')).toHaveClass('text-danger');
  });

  it('Paragraph 支持省略行数和可复制文本', async () => {
    render(
      <Paragraph ellipsis={{ rows: 2 }} copyable>
        食品安全管理员项目需要按批次完成资料审核。
      </Paragraph>,
    );

    expect(screen.getByText('食品安全管理员项目需要按批次完成资料审核。')).toHaveClass('line-clamp-2');
    expect(screen.getByRole('button', { name: '复制文本' })).toBeInTheDocument();
  });
});
