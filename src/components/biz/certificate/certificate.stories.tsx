import type { Meta, StoryObj } from '@storybook/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { CertificateTemplate } from './certificate';

const meta = {
  title: 'Biz/CertificateTemplate',
  component: CertificateTemplate,
  tags: ['autodocs'],
  args: {
    type: 'hours',
    mock: true,
    ba_training_project: 'NEXUS-2026-AI',
    ba_trainning_title: 'AI-AGENT-ENGINEER',
    ba_trainning_type: 'CONTINUING-EDUCATION',
    ba_region_scope: '440000',
  },
  argTypes: {
    ba_training_project: {
      control: 'text',
    },
    ba_trainning_title: {
      control: 'text',
    },
    ba_trainning_type: {
      control: 'text',
    },
    ba_region_scope: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CertificateTemplate>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MockCertificates: Story = {
  render: (args) => {
    const businessProps = {
      ba_training_project: args.ba_training_project,
      ba_trainning_title: args.ba_trainning_title,
      ba_trainning_type: args.ba_trainning_type,
      ba_region_scope: args.ba_region_scope,
    };

    return (
      <Tabs defaultValue="hours" className="w-full">
      <TabsList fullWidth className="mx-auto max-w-3xl">
        <TabsTrigger value="hours">学时证明</TabsTrigger>
        <TabsTrigger value="qualified">合格证明</TabsTrigger>
        <TabsTrigger value="education">学分证书</TabsTrigger>
      </TabsList>
      <TabsContent value="hours" className="border-0 bg-transparent p-0 shadow-none">
        <CertificateTemplate type="hours" mock={args.mock} {...businessProps} />
      </TabsContent>
      <TabsContent value="qualified" className="border-0 bg-transparent p-0 shadow-none">
        <CertificateTemplate type="qualified" mock={args.mock} {...businessProps} />
      </TabsContent>
      <TabsContent value="education" className="border-0 bg-transparent p-0 shadow-none">
        <CertificateTemplate type="education" mock={args.mock} {...businessProps} />
      </TabsContent>
    </Tabs>
    );
  },
};

export const DarkModeTabs: Story = {
  render: (args) => {
    const businessProps = {
      ba_training_project: args.ba_training_project,
      ba_trainning_title: args.ba_trainning_title,
      ba_trainning_type: args.ba_trainning_type,
      ba_region_scope: args.ba_region_scope,
    };

    return (
      <div className="dark rounded-3xl bg-background-dark p-6">
      <Tabs defaultValue="hours" className="w-full">
        <TabsList fullWidth className="mx-auto max-w-3xl">
          <TabsTrigger value="hours">学时证明</TabsTrigger>
          <TabsTrigger value="qualified">合格证明</TabsTrigger>
          <TabsTrigger value="education">学分证书</TabsTrigger>
        </TabsList>
        <TabsContent value="hours" className="border-0 bg-transparent p-0 shadow-none">
          <CertificateTemplate type="hours" mock={args.mock} {...businessProps} />
        </TabsContent>
        <TabsContent value="qualified" className="border-0 bg-transparent p-0 shadow-none">
          <CertificateTemplate type="qualified" mock={args.mock} {...businessProps} />
        </TabsContent>
        <TabsContent value="education" className="border-0 bg-transparent p-0 shadow-none">
          <CertificateTemplate type="education" mock={args.mock} {...businessProps} />
        </TabsContent>
      </Tabs>
    </div>
    );
  },
};
