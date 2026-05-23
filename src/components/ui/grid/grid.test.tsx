import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Col, Row } from './grid';

describe('Grid', () => {
  it('Row 按列数和间距渲染 grid 容器', () => {
    render(
      <Row columns={4} gap="lg" data-testid="row">
        <Col>项目一</Col>
      </Row>,
    );

    expect(screen.getByTestId('row')).toHaveClass('grid');
    expect(screen.getByTestId('row')).toHaveClass('md:grid-cols-4');
    expect(screen.getByTestId('row')).toHaveClass('gap-4');
  });

  it('Col 支持 span 控制占用列', () => {
    render(<Col span={2} data-testid="col">项目详情</Col>);

    expect(screen.getByTestId('col')).toHaveClass('md:col-span-2');
  });
});
