import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs', () => {
  it('基于 Radix Tabs 渲染列表、触发器和内容区域', () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="项目视图">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="members">成员</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">项目概览内容</TabsContent>
        <TabsContent value="members">项目成员内容</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist', { name: '项目视图' })).toHaveClass('rounded-2xl');
    expect(screen.getByRole('tab', { name: '概览' })).toHaveClass('data-[state=active]:bg-surface');
    expect(screen.getByRole('tabpanel', { name: '概览' })).toHaveTextContent('项目概览内容');
  });

  it('补齐科技蓝激活态和暗黑模式类名', () => {
    render(
      <Tabs defaultValue="finance">
        <TabsList>
          <TabsTrigger value="finance">财务</TabsTrigger>
        </TabsList>
        <TabsContent value="finance">财务数据</TabsContent>
      </Tabs>,
    );

    const trigger = screen.getByRole('tab', { name: '财务' });
    const content = screen.getByRole('tabpanel', { name: '财务' });

    expect(trigger.className).toContain('data-[state=active]:text-primary');
    expect(trigger.className).toContain('dark:data-[state=active]:text-primary-dark');
    expect(content.className).toContain('dark:');
  });
});
