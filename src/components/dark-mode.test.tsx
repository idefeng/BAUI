import { readFileSync } from 'node:fs';
import { cleanup, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SmartTable, type SmartTableColumn } from './biz/smart-table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Modal, ModalContent, ModalTitle } from './ui/modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ToastProvider, ToastRoot, ToastTitle, ToastViewport } from './ui/toast';

interface Row {
  id: string;
  name: string;
}

const columns: SmartTableColumn<Row>[] = [{ key: 'name', title: '名称', dataIndex: 'name' }];

describe('dark mode support', () => {
  it('tailwind.config.js 使用 class 驱动暗黑模式', () => {
    const config = readFileSync('tailwind.config.js', 'utf8');

    expect(config).toContain("darkMode: 'class'");
  });

  it('核心 UI 组件包含 dark: 颜色类名', () => {
    render(<Button>保存</Button>);
    expect(screen.getByText('保存').closest('button')?.className).toContain('dark:');
    cleanup();

    render(<Input aria-label="搜索" />);
    expect(screen.getByTestId('boao-input-root').className).toContain('dark:');
    cleanup();

    render(
      <Select defaultOpen defaultValue="all">
        <SelectTrigger aria-label="筛选">
          <SelectValue placeholder="请选择" />
        </SelectTrigger>
        <SelectContent data-testid="select-content">
          <SelectItem value="all">全部</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByTestId('select-content').className).toContain('dark:');
    cleanup();

    render(
      <Modal open>
        <ModalContent>
          <ModalTitle>弹窗</ModalTitle>
        </ModalContent>
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: '弹窗' }).className).toContain('dark:');
    cleanup();

    render(
      <ToastProvider>
        <ToastRoot open variant="success">
          <ToastTitle>成功提示</ToastTitle>
        </ToastRoot>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByText('成功提示').closest('[role="status"]')?.className).toContain('dark:');
  });

  it('SmartTable 包含暗黑模式下的表格、空态和加载样式', () => {
    const { rerender } = render(
      <SmartTable
        columns={columns}
        data={[{ id: '1', name: '暗色测试' }]}
        rowKey="id"
        loading
        pagination={{ page: 1, pageSize: 10, total: 1 }}
      />,
    );

    expect(screen.getByTestId('smart-table-root').className).toContain('dark:');
    expect(screen.getByTestId('smart-table-loading').className).toContain('dark:');

    rerender(<SmartTable columns={columns} data={[]} rowKey="id" emptyText="暂无暗色数据" />);

    expect(screen.getByText('暂无暗色数据').closest('[data-testid="smart-table-empty"]')?.className).toContain('dark:');
  });
});
