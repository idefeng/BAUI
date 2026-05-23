import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Button } from '../button';
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

const meta = {
  title: 'UI/Drawer',
  component: DrawerContent,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'inline-radio',
      options: ['left', 'right', 'top', 'bottom'],
    },
  },
} satisfies Meta<typeof DrawerContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>打开项目详情</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>食品安全管理员项目</DrawerTitle>
          <DrawerDescription>查看报名人数、审核状态和证书签发进度。</DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-3 text-sm text-foreground dark:text-foreground-dark">
          <div className="rounded-xl bg-secondary p-3 dark:bg-secondary-dark">报名人数：128</div>
          <div className="rounded-xl bg-secondary p-3 dark:bg-secondary-dark">待审核资料：6</div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">关闭</Button>
          </DrawerClose>
          <Button>进入项目</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <>
        <Button onClick={() => setOpen(true)}>打开筛选抽屉</Button>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent side="left">
            <DrawerHeader>
              <DrawerTitle>筛选条件</DrawerTitle>
              <DrawerDescription>按项目状态、培训类型和负责人筛选。</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                重置
              </Button>
              <Button onClick={() => setOpen(false)}>应用</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};
