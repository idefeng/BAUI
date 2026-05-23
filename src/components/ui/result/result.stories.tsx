import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Space } from '../space';
import { Result } from './result';

const meta = {
  title: 'UI/Result',
  component: Result,
  tags: ['autodocs'],
  args: {
    status: 'success',
    title: '提交成功',
    subTitle: '资料已进入审核队列。',
  },
  argTypes: {
    status: {
      control: 'inline-radio',
      options: ['success', 'info', 'warning', 'error', '404', '403', '500'],
    },
  },
} satisfies Meta<typeof Result>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    extra: (
      <Space>
        <Button>返回列表</Button>
        <Button variant="outline">继续提交</Button>
      </Space>
    ),
  },
};

export const ErrorPage: Story = {
  args: {
    status: '500',
    title: '服务暂不可用',
    subTitle: '当前证书签发服务繁忙，请稍后刷新重试。',
    extra: <Button>刷新页面</Button>,
  },
};
