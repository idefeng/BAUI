import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Alert } from './alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    variant: 'info',
    title: '资料待审核',
    description: '请在开班前完成学员资质审核。',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const StatusSet: Story = {
  render: () => (
    <div className="grid w-[720px] gap-4">
      <Alert variant="success" title="审核通过" description="本批次 128 名学员资料已完成归档。" />
      <Alert variant="warning" title="待补充材料" description="有 6 名学员缺少身份证正反面照片。" />
      <Alert variant="error" title="提交失败" description="证书编号生成失败，请稍后重试或联系管理员。" closable />
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert
      title="开班前检查"
      description="当前项目仍有未确认的培训地点。"
      closable
    >
      <Button size="sm">立即处理</Button>
    </Alert>
  ),
};
