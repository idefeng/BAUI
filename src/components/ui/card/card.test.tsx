import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

describe('Card', () => {
  it('渲染卡片基础区块并包含现代大圆角和暗黑模式分层', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>项目概览</CardTitle>
          <CardDescription>展示培训项目核心数据。</CardDescription>
        </CardHeader>
        <CardContent>128 名学员</CardContent>
        <CardFooter>更新于今日</CardFooter>
      </Card>,
    );

    const card = screen.getByText('项目概览').closest('[data-slot="card"]');

    expect(card).toHaveClass('rounded-2xl');
    expect(card).toHaveClass('dark:bg-surface-dark/50');
    expect(screen.getByText('展示培训项目核心数据。')).toHaveClass('text-muted-foreground');
  });

  it('hoverable 开启后增加上浮动画类名', () => {
    render(<Card hoverable>可悬浮卡片</Card>);

    expect(screen.getByText('可悬浮卡片')).toHaveClass('hover:-translate-y-1');
    expect(screen.getByText('可悬浮卡片')).toHaveClass('hover:shadow-md');
  });
});
