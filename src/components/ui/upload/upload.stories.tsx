import type { Meta, StoryObj } from '@storybook/react';

import { Upload } from './upload';

const meta = {
  title: 'UI/Upload',
  component: Upload,
  tags: ['autodocs'],
  args: {
    mock: true,
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Upload>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleImage: Story = {
  args: {
    accept: 'image/*',
    maxSize: 3,
    multiple: false,
    mock: true,
  },
};

export const MultipleDragUpload: Story = {
  args: {
    accept: '.pdf,.docx,.xlsx,image/*',
    maxSize: 12,
    multiple: true,
    mock: true,
  },
};

export const LargeFileGuard: Story = {
  args: {
    accept: '.pdf',
    maxSize: 1,
    multiple: false,
    mock: true,
  },
  render: (args) => (
    <div className="grid gap-4">
      <Upload {...args} />
      <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
        选择超过 1MB 的 PDF 或非 PDF 文件时，会在列表中直接展示错误拦截状态。
      </p>
    </div>
  ),
};
