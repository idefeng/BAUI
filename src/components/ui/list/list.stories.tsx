import type { Meta, StoryObj } from '@storybook/react';
import { Bell, ClipboardCheck, FileBadge, Video } from 'lucide-react';

import { Badge } from '../badge';
import { Button } from '../button';
import { List, ListItem, ListItemMeta } from './list';

const meta = {
  title: 'UI/List',
  component: List,
  tags: ['autodocs'],
  args: {
    bordered: true,
    split: true,
  },
  argTypes: {
    bordered: {
      control: 'boolean',
    },
    split: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Notices: Story = {
  render: (args) => (
    <List className="w-[520px]" {...args}>
      <ListItem actions={<Badge variant="primary">新</Badge>}>
        <ListItemMeta avatar={<Bell />} title="开班通知" description="食品安全管理员项目今晚 20:00 开启直播答疑。" />
      </ListItem>
      <ListItem actions={<Badge variant="warning">待确认</Badge>}>
        <ListItemMeta avatar={<Video />} title="直播课程提醒" description="睡眠技师训练营实操课将在 30 分钟后开始。" />
      </ListItem>
      <ListItem actions={<Badge variant="success">已完成</Badge>}>
        <ListItemMeta avatar={<FileBadge />} title="证书签发完成" description="继续医学教育项目已有 128 份证书完成签发。" />
      </ListItem>
    </List>
  ),
};

export const Tasks: Story = {
  render: () => (
    <List bordered className="w-[520px]">
      <ListItem actions={<Button size="sm">处理</Button>}>
        <ListItemMeta avatar={<ClipboardCheck />} title="课后测验复核" description="72 名学员已提交测验，等待教务复核成绩。" />
      </ListItem>
      <ListItem actions={<Button size="sm" variant="outline">查看</Button>}>
        <ListItemMeta avatar={<Bell />} title="签到异常提醒" description="3 名学员未完成手机扫码签到，需要人工确认。" />
      </ListItem>
    </List>
  ),
};
