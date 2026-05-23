import type { Meta, StoryObj } from '@storybook/react';

import { Table, type TableColumn, type TableProps } from './table';

type ProjectStoryRow = Record<string, unknown>;

const columns: TableColumn<ProjectStoryRow>[] = [
  { key: 'projectName', title: '项目名称', dataIndex: 'projectName', width: 220 },
  { key: 'trainingType', title: '培训类型', dataIndex: 'trainingType', width: 130 },
  { key: 'enrolledCount', title: '报名人数', dataIndex: 'enrolledCount', align: 'right', width: 120 },
  { key: 'status', title: '状态', dataIndex: 'status', width: 110 },
];

const data = [
  { id: 'project-1', projectName: '食品安全管理员项目', trainingType: '职业培训', enrolledCount: 126, status: '进行中' },
  { id: 'project-2', projectName: '继续医学教育项目', trainingType: '继续教育', enrolledCount: 88, status: '待开班' },
  { id: 'project-3', projectName: '睡眠技师项目', trainingType: '专项能力提升', enrolledCount: 42, status: '已结项' },
];

const richColumns: TableColumn<ProjectStoryRow>[] = [
  { key: 'projectName', title: '项目名称', dataIndex: 'projectName', fixed: 'left', sortable: true, width: 220 },
  { key: 'trainingType', title: '培训类型', dataIndex: 'trainingType', width: 140 },
  {
    key: 'enrolledCount',
    title: '报名人数',
    dataIndex: 'enrolledCount',
    align: 'right',
    sortable: true,
    sorter: (left, right) => Number(left.enrolledCount ?? 0) - Number(right.enrolledCount ?? 0),
    width: 120,
  },
  { key: 'status', title: '状态', dataIndex: 'status', fixed: 'right', width: 110 },
];

const virtualData = Array.from({ length: 12 }, (_, index) => ({
  id: `project-${index + 1}`,
  projectName: `${data[index % data.length].projectName} ${index + 1}`,
  trainingType: data[index % data.length].trainingType,
  enrolledCount: 38 + index * 7,
  status: data[index % data.length].status,
}));

const ProjectTable = (props: TableProps<ProjectStoryRow>) => <Table<ProjectStoryRow> {...props} />;

const meta = {
  title: 'UI/Table',
  component: ProjectTable,
  tags: ['autodocs'],
  args: {
    rowKey: (record) => String(record.id),
    columns,
    data,
  },
} satisfies Meta<typeof ProjectTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Selectable: Story = {
  args: {
    selectable: true,
    defaultSelectedRowKeys: ['project-1'],
  },
};

export const MockProjectTable: Story = {
  args: {
    mock: true,
    data: undefined,
    columns: undefined,
  },
};

export const SortableFixedVirtual: Story = {
  args: {
    columns: richColumns,
    data: virtualData,
    maxBodyHeight: 320,
    tableClassName: 'min-w-[640px]',
    virtual: true,
    virtualVisibleCount: 6,
  },
};

export const ExpandableRows: Story = {
  args: {
    expandable: true,
    defaultExpandedRowKeys: ['project-1'],
    renderExpandedRow: (record) => (
      <div className="grid gap-2 text-sm">
        <div className="font-medium text-foreground dark:text-foreground-dark">{String(record.projectName)} 排课摘要</div>
        <div className="text-muted-foreground dark:text-muted-dark-foreground">
          培训类型：{String(record.trainingType)}；报名人数：{String(record.enrolledCount)}；当前状态：{String(record.status)}
        </div>
      </div>
    ),
  },
};
