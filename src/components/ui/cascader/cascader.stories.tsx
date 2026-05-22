import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { Cascader, type CascaderOption } from './cascader';

const departmentOptions: CascaderOption[] = [
  {
    value: 'technology',
    label: '技术中心',
    children: [
      {
        value: 'core-rd',
        label: '核心研发部',
        children: [
          { value: 'frontend', label: '前端组' },
          { value: 'backend', label: '后端组' },
          { value: 'quality', label: '质量工程组' },
        ],
      },
      {
        value: 'platform',
        label: '平台工程部',
        children: [
          { value: 'devops', label: 'DevOps 组' },
          { value: 'data', label: '数据平台组' },
        ],
      },
    ],
  },
  {
    value: 'product',
    label: '学习产品中心',
    children: [
      {
        value: 'course',
        label: '课程产品部',
        children: [
          { value: 'medical', label: '继续教育组' },
          { value: 'occupation', label: '职业培训组' },
        ],
      },
    ],
  },
];

const StatefulCascader = ({
  defaultValue = [],
  mock = false,
}: {
  defaultValue?: string[];
  mock?: boolean;
}) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <Cascader
      mock={mock}
      options={mock ? undefined : departmentOptions}
      value={value}
      placeholder="请选择组织"
      onChange={setValue}
    />
  );
};

const meta = {
  title: 'UI/Cascader',
  component: Cascader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Cascader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="w-80">
      <StatefulCascader />
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <div className="w-80">
      <StatefulCascader defaultValue={['technology', 'core-rd', 'frontend']} />
    </div>
  ),
};

export const MockModeDemo: Story = {
  render: () => (
    <div className="w-80">
      <StatefulCascader mock />
    </div>
  ),
};
