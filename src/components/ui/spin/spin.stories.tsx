import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { Spin } from './spin';

const meta = {
  title: 'UI/Spin',
  component: Spin,
  tags: ['autodocs'],
  args: {
    spinning: true,
    tip: '数据加载中',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Spin>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const InsideCard: Story = {
  render: () => (
    <Spin spinning tip="保存中">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>培训项目资料</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
          正在同步学员名单和证书签发状态。
        </CardContent>
      </Card>
    </Spin>
  ),
};
