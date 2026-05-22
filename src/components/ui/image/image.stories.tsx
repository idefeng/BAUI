import type { Meta, StoryObj } from '@storybook/react';

import { Image } from './image';

const posterImage = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420"><rect width="720" height="420" rx="40" fill="hsl(214 82% 46%)"/><rect x="56" y="64" width="300" height="40" rx="20" fill="hsl(0 0% 100% / 0.92)"/><rect x="56" y="130" width="460" height="28" rx="14" fill="hsl(0 0% 100% / 0.68)"/><rect x="56" y="182" width="220" height="112" rx="24" fill="hsl(0 0% 100% / 0.18)"/><circle cx="562" cy="208" r="92" fill="hsl(168 66% 54% / 0.72)"/></svg>',
)}`;

const meta = {
  title: 'UI/Image',
  component: Image,
  tags: ['autodocs'],
  args: {
    src: posterImage,
    alt: '课程海报',
    preview: false,
    wrapperClassName: 'h-64 w-[440px]',
  },
  argTypes: {
    preview: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Preview: Story = {
  args: {
    preview: true,
  },
};

export const ErrorState: Story = {
  args: {
    src: 'https://boao.invalid/missing-course-poster.png',
    alt: '加载失败的海报',
    wrapperClassName: 'h-64 w-[440px]',
  },
};
