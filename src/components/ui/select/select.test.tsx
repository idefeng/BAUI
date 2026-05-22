import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

describe('Select', () => {
  it('基于 Radix Select 渲染触发器和选项浮层', () => {
    render(
      <Select defaultOpen defaultValue="design">
        <SelectTrigger aria-label="选择分类">
          <SelectValue placeholder="请选择" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="design">设计规范</SelectItem>
          <SelectItem value="dev">研发规范</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox', { hidden: true, name: '选择分类' })).toHaveClass('rounded-xl');
    expect(screen.getByRole('option', { name: '设计规范' })).toBeInTheDocument();
  });

  it('下拉浮层使用现代大圆角和淡入淡出动画类名', () => {
    render(
      <Select defaultOpen defaultValue="primary">
        <SelectTrigger aria-label="主题色">
          <SelectValue placeholder="请选择主题色" />
        </SelectTrigger>
        <SelectContent data-testid="select-content">
          <SelectItem value="primary">科技蓝</SelectItem>
        </SelectContent>
      </Select>,
    );

    const content = screen.getByTestId('select-content');

    expect(content).toHaveClass('rounded-2xl');
    expect(content).toHaveClass('data-[state=open]:animate-select-in');
    expect(content).toHaveClass('data-[state=closed]:animate-select-out');
  });

  it('mock 模式会自动加载业务下拉选项', () => {
    render(<Select mock mockType="department" defaultOpen />);

    expect(screen.getByRole('combobox', { hidden: true, name: '选择项目' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '住建项目' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '食品安全管理员项目' })).toBeInTheDocument();
  });
});
