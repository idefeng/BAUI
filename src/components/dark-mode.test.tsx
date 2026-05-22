import { readFileSync } from 'node:fs';
import { cleanup, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CertificateTemplate } from './biz/certificate';
import { LearningProfile } from './biz/profile';
import { NavMenu } from './biz/navigation';
import { SmartTable, type SmartTableColumn } from './biz/smart-table';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Modal, ModalContent, ModalTitle } from './ui/modal';
import { Pagination } from './ui/pagination';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ToastProvider, ToastRoot, ToastTitle, ToastViewport } from './ui/toast';
import { Upload } from './ui/upload';

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

    render(<Pagination total={80} currentPage={2} onPageChange={() => undefined} />);
    expect(screen.getByTestId('pagination-root').className).toContain('dark:');
    cleanup();

    render(<Skeleton data-testid="骨架屏" />);
    expect(screen.getByTestId('骨架屏').className).toContain('dark:');
    cleanup();

    render(<Upload />);
    expect(screen.getByTestId('upload-root').className).toContain('dark:');
    expect(screen.getByTestId('upload-dropzone').className).toContain('dark:');
    cleanup();

    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger asChild>
            <button type="button">说明</button>
          </TooltipTrigger>
          <TooltipContent>暗黑提示</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getAllByText('暗黑提示')[0].className).toContain('dark:');
    cleanup();

    render(<Switch aria-label="开关" defaultChecked />);
    expect(screen.getByRole('switch', { name: '开关' }).className).toContain('dark:');
    cleanup();

    render(<Checkbox aria-label="勾选" defaultChecked />);
    expect(screen.getByRole('checkbox', { name: '勾选' }).className).toContain('dark:');
    cleanup();

    render(
      <RadioGroup defaultValue="daily">
        <RadioGroupItem aria-label="每日" value="daily" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: '每日' }).className).toContain('dark:');
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

  it('CertificateTemplate 包含暗黑模式下的黑金/暗银证书样式', () => {
    render(<CertificateTemplate type="qualified" mock showActions={false} />);

    expect(screen.getByTestId('certificate-paper').className).toContain('dark:');
    expect(screen.getByTestId('certificate-inner-border').className).toContain('dark:');
  });

  it('LearningProfile 包含暗黑模式下的学习档案样式', () => {
    render(<LearningProfile studentId="student-it-001" />);

    expect(screen.getByTestId('learning-profile-root').className).toContain('dark:');
    expect(screen.getByTestId('learning-profile-summary-card-totalHours').className).toContain('dark:');
  });

  it('NavMenu 包含暗黑模式下的企业导航样式', () => {
    render(<NavMenu mock currentPath="/" />);

    expect(screen.getByTestId('nav-menu-root').className).toContain('dark:');
    expect(screen.getByTestId('nav-menu-item-home').className).toContain('dark:');
  });
});
