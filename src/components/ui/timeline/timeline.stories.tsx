import type { Meta, StoryObj } from '@storybook/react';

import { Timeline } from './timeline';

const items = [
  { title: '提交报名资料', description: '学员完成基础信息填写。', time: '09:30', status: 'success' as const },
  { title: '管理员审核', description: '等待项目负责人复核。', time: '10:15', status: 'process' as const },
  { title: '证书签发', description: '审核通过后自动生成证书。', status: 'wait' as const },
];

const meta = {
  title: 'UI/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  args: {
    items,
  },
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithPending: Story = {
  args: {
    pending: '等待证书签发',
  },
};

export const ErrorRecord: Story = {
  args: {
    items: [
      items[0],
      { title: '资料驳回', description: '身份证照片不清晰，需要重新上传。', time: '10:20', status: 'error' },
      items[2],
    ],
  },
};
