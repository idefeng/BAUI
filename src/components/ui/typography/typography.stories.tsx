import type { Meta, StoryObj } from '@storybook/react';

import { Space } from '../space';
import { Paragraph, Text, Title } from './typography';

const meta = {
  title: 'UI/Typography',
  component: Title,
  tags: ['autodocs'],
} satisfies Meta<typeof Title>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="w-[680px] space-y-4">
      <Title level={2}>食品安全管理员项目总览</Title>
      <Paragraph>
        面向企业培训、考试组织和证书归档的统一项目工作台，适合在后台页面里展示清晰的信息层级。
      </Paragraph>
      <Space wrap>
        <Text strong>核心指标</Text>
        <Text muted>辅助说明</Text>
        <Text type="success">已通过</Text>
        <Text type="warning">待审核</Text>
        <Text type="danger">异常任务</Text>
      </Space>
    </div>
  ),
};

export const CopyableParagraph: Story = {
  render: () => (
    <div className="w-[520px]">
      <Paragraph copyable ellipsis={{ rows: 2 }}>
        继续医学教育项目需要按培训批次完成资料审核、学习记录归档和证书签发，超出两行后保留摘要阅读体验。
      </Paragraph>
    </div>
  ),
};
