import type { Meta, StoryObj } from '@storybook/react';

import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSider } from './layout';

const meta = {
  title: 'UI/Layout',
  component: Layout,
  tags: ['autodocs'],
} satisfies Meta<typeof Layout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AdminShell: Story = {
  render: () => (
    <Layout className="w-[860px] flex-col overflow-hidden rounded-2xl border border-border dark:border-border-dark">
      <LayoutHeader>BOAO UI 后台</LayoutHeader>
      <Layout className="min-h-80">
        <LayoutSider>项目管理</LayoutSider>
        <LayoutContent>
          <div className="rounded-2xl bg-secondary p-6 dark:bg-secondary-dark">页面内容区域</div>
        </LayoutContent>
      </Layout>
      <LayoutFooter>© BOAO UI</LayoutFooter>
    </Layout>
  ),
};

export const CollapsedSider: Story = {
  render: () => (
    <Layout className="w-[760px] min-h-72 overflow-hidden rounded-2xl border border-border dark:border-border-dark">
      <LayoutSider collapsed>导航</LayoutSider>
      <LayoutContent>收起侧边栏布局</LayoutContent>
    </Layout>
  ),
};
