import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { TreeSelect, type TreeSelectNode } from './tree-select';

const organizationTree: TreeSelectNode[] = [
  {
    key: 'hq',
    title: '集团总部',
    children: [
      {
        key: 'rd',
        title: '研发中心',
        children: [
          { key: 'frontend', title: '前端组' },
          { key: 'agent', title: 'AI Agent 组' },
          { key: 'platform', title: '平台工程组' },
        ],
      },
      {
        key: 'operations',
        title: '运营中心',
        children: [
          { key: 'customer-success', title: '客户成功组' },
          { key: 'learning-ops', title: '学习运营组' },
        ],
      },
    ],
  },
];

const ControlledTreeSelect = (props: React.ComponentProps<typeof TreeSelect>) => {
  const [value, setValue] = React.useState<string[]>(props.value ?? []);

  return (
    <div className="w-[min(92vw,32rem)]">
      <TreeSelect {...props} value={value} onChange={setValue} />
    </div>
  );
};

const meta = {
  title: 'UI/TreeSelect',
  component: TreeSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TreeSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleMode: Story = {
  render: () => (
    <ControlledTreeSelect
      multiple={false}
      treeData={organizationTree}
      placeholder="请选择负责小组"
    />
  ),
};

export const MultipleCascade: Story = {
  render: () => (
    <ControlledTreeSelect
      treeData={organizationTree}
      value={['frontend']}
      placeholder="请选择组织范围"
    />
  ),
};

export const MockModeDemo: Story = {
  render: () => <ControlledTreeSelect mock placeholder="请选择全球组织范围" />,
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background-dark p-6">
      <ControlledTreeSelect mock placeholder="请选择全球组织范围" />
    </div>
  ),
};
