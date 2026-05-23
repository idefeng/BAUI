import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

describe('Drawer', () => {
  it('基于 Radix Dialog 渲染右侧抽屉、标题和描述', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>项目详情</DrawerTitle>
            <DrawerDescription>查看培训项目基础信息。</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByRole('dialog', { name: '项目详情' })).toHaveClass('right-0');
    expect(screen.getByText('查看培训项目基础信息。')).toHaveClass('text-muted-foreground');
  });

  it('支持左侧方向和自定义页脚操作', () => {
    render(
      <Drawer open>
        <DrawerContent side="left">
          <DrawerTitle>筛选条件</DrawerTitle>
          <DrawerFooter>
            <button type="button">重置</button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    );

    expect(screen.getByRole('dialog', { name: '筛选条件' })).toHaveClass('left-0');
    expect(screen.getByRole('button', { name: '重置' })).toBeInTheDocument();
  });

  it('支持触发器和关闭按钮的受控回调', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Drawer onOpenChange={onOpenChange}>
        <DrawerTrigger>打开抽屉</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>项目详情</DrawerTitle>
          <DrawerClose>关闭</DrawerClose>
        </DrawerContent>
      </Drawer>,
    );

    await user.click(screen.getByRole('button', { name: '打开抽屉' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
