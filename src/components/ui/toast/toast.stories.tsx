import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { ToastHost, ToastProvider, ToastRoot, ToastDescription, ToastTitle, ToastViewport, useToast } from './toast';

const meta = {
  title: 'UI/Toast',
  component: ToastRoot,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ToastRoot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const { removeToast, showToast, toasts } = useToast();

    return (
      <ToastHost toasts={toasts} onRemove={removeToast}>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() =>
              showToast({
                title: '保存成功',
                description: '组件配置已同步到当前预览环境。',
                variant: 'success',
              })
            }
          >
            成功提示
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              showToast({
                title: '提交失败',
                description: '请检查必填字段后重新提交。',
                variant: 'error',
              })
            }
          >
            错误提示
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              showToast({
                title: '系统提示',
                description: 'Toast 会在 5 秒后自动从右上角滑出。',
                variant: 'info',
              })
            }
          >
            信息提示
          </Button>
        </div>
      </ToastHost>
    );
  },
};

export const Variants: Story = {
  render: () => (
    <ToastProvider>
      <div className="grid w-96 gap-3">
        <ToastRoot open variant="success">
          <ToastTitle>保存成功</ToastTitle>
          <ToastDescription>绿色状态用于正向反馈。</ToastDescription>
        </ToastRoot>
        <ToastRoot open variant="error">
          <ToastTitle>保存失败</ToastTitle>
          <ToastDescription>红色状态用于错误和阻断反馈。</ToastDescription>
        </ToastRoot>
        <ToastRoot open variant="info">
          <ToastTitle>系统提示</ToastTitle>
          <ToastDescription>蓝色状态用于普通信息提示。</ToastDescription>
        </ToastRoot>
      </div>
      <ToastViewport />
    </ToastProvider>
  ),
};
