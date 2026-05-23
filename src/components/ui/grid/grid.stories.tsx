import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent } from '../card';
import { Col, Row } from './grid';

const meta = {
  title: 'UI/Grid',
  component: Row,
  tags: ['autodocs'],
  args: {
    columns: 3,
    gap: 'md',
  },
  argTypes: {
    columns: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6, 12] },
    gap: { control: 'inline-radio', options: ['none', 'xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Row>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Cards: Story = {
  render: (args) => (
    <Row {...args} className="w-[720px]">
      <Col>
        <Card><CardContent className="p-4">报名人数 128</CardContent></Card>
      </Col>
      <Col>
        <Card><CardContent className="p-4">审核完成 92%</CardContent></Card>
      </Col>
      <Col>
        <Card><CardContent className="p-4">证书签发 86</CardContent></Card>
      </Col>
    </Row>
  ),
};

export const Spanned: Story = {
  render: () => (
    <Row columns={4} gap="lg" className="w-[760px]">
      <Col span={2}>
        <Card><CardContent className="p-4">项目概览跨两列</CardContent></Card>
      </Col>
      <Col>
        <Card><CardContent className="p-4">待审核</CardContent></Card>
      </Col>
      <Col>
        <Card><CardContent className="p-4">已归档</CardContent></Card>
      </Col>
    </Row>
  ),
};
