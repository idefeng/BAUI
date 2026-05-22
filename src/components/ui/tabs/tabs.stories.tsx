import type { Meta, StoryObj } from '@storybook/react';
import { BarChart3, FileText, Settings, Users } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-full max-w-3xl">
      <TabsList aria-label="项目视图">
        <TabsTrigger value="overview">概览</TabsTrigger>
        <TabsTrigger value="members">成员</TabsTrigger>
        <TabsTrigger value="settings">设置</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        项目概览展示关键指标、最近更新和待处理事项，适合放在详情页首屏。
      </TabsContent>
      <TabsContent value="members">成员视图用于展示项目负责人、协作团队和权限分组。</TabsContent>
      <TabsContent value="settings">设置视图用于维护项目状态、通知规则和数据权限。</TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="reports" className="w-full max-w-3xl">
      <TabsList aria-label="数据中心">
        <TabsTrigger value="reports" icon={<FileText />}>
          报告
        </TabsTrigger>
        <TabsTrigger value="analytics" icon={<BarChart3 />}>
          分析
        </TabsTrigger>
        <TabsTrigger value="users" icon={<Users />}>
          用户
        </TabsTrigger>
      </TabsList>
      <TabsContent value="reports">报告列表承载导出记录、审批状态和最近生成时间。</TabsContent>
      <TabsContent value="analytics">分析面板用于放置趋势图、同比数据和业务洞察。</TabsContent>
      <TabsContent value="users">用户面板展示账号活跃度、角色分布和访问记录。</TabsContent>
    </Tabs>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-full max-w-4xl rounded-2xl border border-border bg-surface p-6 shadow-button dark:border-border-dark dark:bg-surface-dark">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList fullWidth aria-label="账户设置">
          <TabsTrigger value="profile" icon={<Users />}>
            基本资料
          </TabsTrigger>
          <TabsTrigger value="security" icon={<Settings />}>
            安全设置
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">维护姓名、部门、联系电话等基础档案信息。</TabsContent>
        <TabsContent value="security">配置登录保护、二次验证和敏感操作确认策略。</TabsContent>
      </Tabs>
    </div>
  ),
};
