import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Descriptions } from './descriptions';

const items = [
  { label: '项目名称', children: '食品安全管理员项目' },
  { label: '培训类型', children: '专项能力提升' },
  { label: '负责人', children: '李老师' },
];

describe('Descriptions', () => {
  it('按 items 渲染描述列表标签和值', () => {
    render(<Descriptions title="项目基础信息" items={items} />);

    expect(screen.getByText('项目基础信息')).toHaveClass('text-foreground');
    expect(screen.getByText('项目名称')).toHaveClass('text-muted-foreground');
    expect(screen.getByText('食品安全管理员项目')).toHaveClass('text-foreground');
  });

  it('bordered 开启后展示分组边框样式', () => {
    render(<Descriptions bordered items={items} data-testid="descriptions" />);

    expect(screen.getByTestId('descriptions')).toHaveClass('border');
    expect(screen.getByText('培训类型').parentElement).toHaveClass('border-border');
  });

  it('支持 column 控制布局列数', () => {
    render(<Descriptions column={3} items={items} data-testid="descriptions" />);

    expect(screen.getByTestId('descriptions').firstElementChild).toHaveClass('md:grid-cols-3');
  });
});
