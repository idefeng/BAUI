import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RotateCcw } from 'lucide-react';

import { SmartTable, type SmartTableColumn, type SmartTableFilterOption } from './smart-table';

interface ApiProjectRow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'draft';
  owner: string;
  department: string;
  updatedAt: string;
}

const statusLabels: Record<ApiProjectRow['status'], string> = {
  active: '启用',
  paused: '暂停',
  draft: '草稿',
};

const statusClassNames: Record<ApiProjectRow['status'], string> = {
  active: 'bg-success-soft text-success',
  paused: 'bg-danger-soft text-danger',
  draft: 'bg-secondary text-muted-foreground',
};

const mockRows: ApiProjectRow[] = Array.from({ length: 36 }, (_, index) => {
  const statuses: ApiProjectRow['status'][] = ['active', 'paused', 'draft'];
  const departments = ['资源平台部', '教学运营部', '医学内容部'];

  return {
    id: `BA-${String(index + 1).padStart(3, '0')}`,
    name: ['区域机构账号治理', '课程资源审核中台', '医教协同数据看板', '培训项目报名管理'][index % 4],
    status: statuses[index % statuses.length],
    owner: ['林医生', '王老师', '陈主任', '赵经理'][index % 4],
    department: departments[index % departments.length],
    updatedAt: `2026-05-${String((index % 22) + 1).padStart(2, '0')}`,
  };
});

const columns: SmartTableColumn<ApiProjectRow>[] = [
  {
    key: 'name',
    title: '项目名称',
    dataIndex: 'name',
    ellipsis: true,
    width: 220,
  },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    width: 110,
    render: (value) => {
      const status = value as ApiProjectRow['status'];

      return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClassNames[status]}`}>
          {statusLabels[status]}
        </span>
      );
    },
  },
  {
    key: 'owner',
    title: '负责人',
    dataIndex: 'owner',
    width: 120,
  },
  {
    key: 'department',
    title: '所属部门',
    dataIndex: 'department',
    ellipsis: true,
  },
  {
    key: 'updatedAt',
    title: '更新时间',
    dataIndex: 'updatedAt',
    width: 140,
    align: 'right',
  },
];

const filterOptions: SmartTableFilterOption[] = [
  { label: '全部状态', value: 'all' },
  { label: '启用', value: 'active' },
  { label: '暂停', value: 'paused' },
  { label: '草稿', value: 'draft' },
];

const fetchProjects = async ({
  page,
  pageSize,
  keyword,
  status,
}: {
  page: number;
  pageSize: number;
  keyword: string;
  status: string;
}) => {
  await new Promise((resolve) => window.setTimeout(resolve, 650));

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredRows = mockRows.filter((row) => {
    const matchKeyword =
      !normalizedKeyword ||
      row.name.toLowerCase().includes(normalizedKeyword) ||
      row.owner.toLowerCase().includes(normalizedKeyword) ||
      row.department.toLowerCase().includes(normalizedKeyword);
    const matchStatus = status === 'all' || row.status === status;

    return matchKeyword && matchStatus;
  });
  const start = (page - 1) * pageSize;

  return {
    rows: filteredRows.slice(start, start + pageSize),
    total: filteredRows.length,
  };
};

const meta = {
  title: 'Biz/SmartTable',
  component: SmartTable<ApiProjectRow>,
  tags: ['autodocs'],
  args: {
    columns,
    data: [],
    rowKey: 'id',
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SmartTable<ApiProjectRow>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ApiRequest: Story = {
  render: () => {
    const [keyword, setKeyword] = React.useState('');
    const [status, setStatus] = React.useState('all');
    const [page, setPage] = React.useState(1);
    const [rows, setRows] = React.useState<ApiProjectRow[]>([]);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const pageSize = 8;

    React.useEffect(() => {
      let ignore = false;

      setLoading(true);
      fetchProjects({ page, pageSize, keyword, status })
        .then((result) => {
          if (ignore) {
            return;
          }

          setRows(result.rows);
          setTotal(result.total);
        })
        .finally(() => {
          if (!ignore) {
            setLoading(false);
          }
        });

      return () => {
        ignore = true;
      };
    }, [keyword, page, status]);

    return (
      <SmartTable<ApiProjectRow>
        columns={columns}
        data={rows}
        rowKey="id"
        selectable
        loading={loading}
        searchValue={keyword}
        searchPlaceholder="搜索项目、负责人或部门"
        onSearchChange={(value) => {
          setKeyword(value);
          setPage(1);
        }}
        filterValue={status}
        filterOptions={filterOptions}
        onFilterChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        actionLabel="重置条件"
        actionIcon={<RotateCcw />}
        actionVariant="outline"
        onAction={() => {
          setKeyword('');
          setStatus('all');
          setPage(1);
        }}
        pagination={{ page, pageSize, total }}
        onPageChange={(nextPage) => setPage(nextPage)}
        emptyText="没有匹配的项目"
      />
    );
  },
};

export const Empty: Story = {
  render: () => (
    <SmartTable<ApiProjectRow>
      columns={columns}
      data={[]}
      rowKey="id"
      searchValue=""
      filterValue="all"
      filterOptions={filterOptions}
      actionLabel="新增项目"
      emptyText="暂无项目数据"
    />
  ),
};
