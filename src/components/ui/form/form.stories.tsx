import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

import { Form, type FormSchemaField, type FormValues } from './form';

const learnerProfileSchema: FormSchemaField[] = [
  {
    name: 'studentName',
    label: '学员姓名',
    type: 'input',
    placeholder: '请输入学员姓名',
    mock: 'name',
  },
  {
    name: 'phone',
    label: '联系电话',
    type: 'input',
    placeholder: '请输入联系电话',
    mock: 'phone',
  },
  {
    name: 'project',
    label: '报名项目',
    type: 'select',
    placeholder: '请选择报名项目',
    mock: 'project',
  },
  {
    name: 'intranetEnabled',
    label: '是否开通内网权限',
    type: 'switch',
  },
  {
    name: 'techDirections',
    label: '选修技术方向',
    type: 'checkbox',
    mock: true,
  },
  {
    name: 'expectedSalary',
    label: '期望薪资',
    type: 'slider',
    min: 8000,
    max: 20000,
    step: 1000,
  },
  {
    name: 'assignedLearners',
    label: '分配学员',
    type: 'transfer',
    titles: ['未分配学员', '已分配学员'],
    mock: true,
  },
  {
    name: 'organizationScope',
    label: '组织范围',
    type: 'treeselect',
    placeholder: '请选择组织范围',
    mock: true,
  },
];

const LearnerProfileForm = () => {
  const [value, setValue] = React.useState<FormValues>({
    studentName: '',
    phone: '',
    project: '',
    intranetEnabled: false,
    techDirections: [],
    expectedSalary: 12000,
    assignedLearners: ['transfer-user-001', 'transfer-user-004'],
    organizationScope: ['global-apac-rd-frontend', 'global-apac-rd-ai'],
  });

  return (
    <div className="w-[min(94vw,72rem)] rounded-2xl border border-border bg-surface p-6 shadow-button dark:border-border-dark dark:bg-surface-dark">
      <Form schema={learnerProfileSchema} value={value} onChange={setValue} />
    </div>
  );
};

const meta = {
  title: 'UI/Form',
  component: Form,
  tags: ['autodocs'],
  args: {
    schema: learnerProfileSchema,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LearnerProfile: Story = {
  render: () => <LearnerProfileForm />,
};
