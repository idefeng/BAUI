import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Clock3 } from 'lucide-react';

import { Badge } from '../badge';
import { Button } from '../button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    hoverable: false,
  },
  argTypes: {
    hoverable: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Card className="w-96" {...args}>
      <CardHeader>
        <CardTitle>食品安全管理员项目</CardTitle>
        <CardDescription>用于展示项目概览、学员进度和证书状态。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground dark:text-muted-dark-foreground">学员</p>
            <p className="mt-1 font-semibold text-foreground dark:text-foreground-dark">286</p>
          </div>
          <div>
            <p className="text-muted-foreground dark:text-muted-dark-foreground">通过率</p>
            <p className="mt-1 font-semibold text-foreground dark:text-foreground-dark">92%</p>
          </div>
          <div>
            <p className="text-muted-foreground dark:text-muted-dark-foreground">证书</p>
            <p className="mt-1 font-semibold text-foreground dark:text-foreground-dark">128</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Clock3 className="size-4" aria-hidden="true" />
        今日 09:30 更新
      </CardFooter>
    </Card>
  ),
};

export const HoverableAction: Story = {
  render: () => (
    <Card hoverable className="w-96">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>继续医学教育班</CardTitle>
            <CardDescription>72 名学员待完成课后测验。</CardDescription>
          </div>
          <Badge variant="warning">待处理</Badge>
        </div>
      </CardHeader>
      <CardFooter className="justify-between">
        <span>预计今晚 20:00 截止</span>
        <Button size="sm" rightIcon={<ArrowRight />}>
          查看
        </Button>
      </CardFooter>
    </Card>
  ),
};
