import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Empty } from './empty';

describe('Empty', () => {
  it('默认展示空状态标题和描述', () => {
    render(<Empty />);

    expect(screen.getByText('暂无数据')).toHaveClass('text-foreground');
    expect(screen.getByText('当前没有可展示的内容')).toHaveClass('text-muted-foreground');
  });

  it('支持 mock 业务空态和操作区', () => {
    render(<Empty mock action={<button type="button">新建项目</button>} />);

    expect(screen.getByText('暂无培训项目')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '新建项目' })).toBeInTheDocument();
  });
});
