import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../button';
import { Carousel, type CarouselSlide } from './carousel';

const createBannerImage = (hue: number) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="480" viewBox="0 0 960 480"><rect width="960" height="480" fill="hsl(${hue} 72% 44%)"/><circle cx="760" cy="120" r="120" fill="hsl(${hue + 24} 82% 62% / 0.45)"/><circle cx="820" cy="320" r="170" fill="hsl(${hue - 18} 86% 38% / 0.36)"/><rect x="560" y="140" width="260" height="180" rx="32" fill="hsl(0 0% 100% / 0.22)"/></svg>`,
  )}`;

const slides: CarouselSlide[] = [
  {
    id: 'food-safety',
    eyebrow: '企业培训',
    title: '食品安全管理员项目',
    description: '面向企业学员的签到、修读和证书核验统一入口。',
    image: createBannerImage(214),
    action: <Button size="sm">查看班级</Button>,
  },
  {
    id: 'medical',
    eyebrow: '继续教育',
    title: '继续医学教育课程',
    description: '课程提醒、学时统计和考核任务集中展示。',
    image: createBannerImage(168),
    action: <Button size="sm" variant="outline">同步学时</Button>,
  },
  {
    id: 'sleep',
    eyebrow: '专项能力',
    title: '睡眠技师训练营',
    description: '结合实操任务和阶段测评，持续追踪学习进度。',
    image: createBannerImage(268),
    action: <Button size="sm" variant="ghost">查看海报</Button>,
  },
];

const meta = {
  title: 'UI/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: {
    slides,
    autoplay: false,
  },
  argTypes: {
    autoplay: {
      control: 'boolean',
    },
    interval: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => <Carousel className="w-[760px]" {...args} />,
};

export const Autoplay: Story = {
  args: {
    autoplay: true,
    interval: 2400,
  },
  render: (args) => <Carousel className="w-[760px]" {...args} />,
};
