import * as React from 'react';
import { CalendarClock, GraduationCap, Layers3, Search, UsersRound } from 'lucide-react';

import { cn } from '../../../lib/utils';
import {
  mockCardGridItems,
  type MockCardGridItem,
} from '../../../utils/mock';
import { Card } from '../../ui/card';
import { Form, type FormSchemaField, type FormValues } from '../../ui/form';
import { Pagination, getPageCount } from '../../ui/pagination';
import { Skeleton } from '../../ui/skeleton';

export type CardGridItem = MockCardGridItem;

export interface CardGridPageProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** 开启后使用中央 mock 卡片数据，并让 Form 一键填表触发卡片区骨架屏。 */
  mock?: boolean;
  /** 外部真实卡片数据；传入后优先级高于 mock 数据。 */
  items?: CardGridItem[];
  /** 页面标题。 */
  title?: React.ReactNode;
  /** 页面副标题。 */
  description?: React.ReactNode;
  /** 每页卡片数量，默认 6。 */
  pageSize?: number;
}

const loadingDuration = 650;

const searchSchema: FormSchemaField[] = [
  {
    name: 'keyword',
    label: '项目关键词',
    type: 'input',
    placeholder: '搜索项目名称或负责人',
    mock: 'name',
  },
  {
    name: 'project',
    label: '项目类型',
    type: 'select',
    placeholder: '请选择项目',
    mock: 'project',
  },
  {
    name: 'trainingType',
    label: '培训类型',
    type: 'select',
    placeholder: '请选择培训类型',
    mock: 'trainingType',
  },
  {
    name: 'status',
    label: '项目状态',
    type: 'select',
    placeholder: '请选择项目状态',
    mock: 'status',
  },
];

const statusClassNames: Record<CardGridItem['status'], string> = {
  进行中: 'bg-success-soft text-success dark:bg-success-dark-soft dark:text-success-dark',
  待开班: 'bg-warning-soft text-warning dark:bg-warning-dark-soft dark:text-warning-dark',
  已结项: 'bg-secondary text-muted-foreground dark:bg-secondary-dark dark:text-muted-dark-foreground',
};

const defaultFormValue: FormValues = {
  keyword: '',
  project: '',
  status: '',
  trainingType: '',
};

const isFilledValue = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

const isMockFilledSearch = (value: FormValues) =>
  ['keyword', 'project', 'trainingType', 'status'].every((fieldName) => isFilledValue(value[fieldName]));

function CardGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <Card
          key={index}
          data-testid="card-grid-skeleton-card"
          className="grid gap-4 p-5 dark:border-border-dark dark:bg-surface-dark/70"
        >
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
          <Skeleton className="h-16 rounded-2xl" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function CardGridItemCard({ item }: { item: CardGridItem }) {
  return (
    <Card
      data-testid="card-grid-item-card"
      hoverable
      className="group relative overflow-hidden p-5 transition-all duration-300 dark:bg-surface-dark/70"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-primary/30 dark:bg-primary-dark/40" aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-primary dark:text-primary-dark">{item.trainingType}</p>
          <h3 className="mt-2 truncate text-lg font-bold tracking-normal text-foreground dark:text-foreground-dark">
            {item.title}
          </h3>
        </div>
        <span className={cn('shrink-0 rounded-full px-3 py-1 text-xs font-semibold', statusClassNames[item.status])}>
          {item.status}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
        {item.description}
      </p>

      <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-2xl bg-secondary p-3 dark:bg-secondary-dark">
          <UsersRound className="mb-2 size-4 text-primary dark:text-primary-dark" aria-hidden="true" />
          <p className="text-xs text-muted-foreground dark:text-muted-dark-foreground">学员</p>
          <p className="font-bold text-foreground dark:text-foreground-dark">{item.learnerCount} 人</p>
        </div>
        <div className="rounded-2xl bg-secondary p-3 dark:bg-secondary-dark">
          <CalendarClock className="mb-2 size-4 text-primary dark:text-primary-dark" aria-hidden="true" />
          <p className="text-xs text-muted-foreground dark:text-muted-dark-foreground">更新</p>
          <p className="font-bold text-foreground dark:text-foreground-dark">{item.updatedAt}</p>
        </div>
        <div className="rounded-2xl bg-secondary p-3 dark:bg-secondary-dark">
          <GraduationCap className="mb-2 size-4 text-primary dark:text-primary-dark" aria-hidden="true" />
          <p className="text-xs text-muted-foreground dark:text-muted-dark-foreground">负责人</p>
          <p className="truncate font-bold text-foreground dark:text-foreground-dark">{item.owner}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground dark:border-border-dark dark:bg-background-dark dark:text-muted-dark-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}

/** CardGridPage 是带搜索表单、卡片流和分页的业务模板页。 */
export function CardGridPage({
  className,
  description = '用表单筛选项目卡片，适合项目库、课程库、证书模板库等业务入口。',
  items,
  mock = false,
  pageSize = 6,
  title = '项目卡片检索',
  ...props
}: CardGridPageProps) {
  const [formValue, setFormValue] = React.useState<FormValues>(defaultFormValue);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const loadingTimerRef = React.useRef<number | null>(null);
  const dataSource = React.useMemo(() => {
    if (items && items.length > 0) {
      return items;
    }

    return mock ? mockCardGridItems(12) : [];
  }, [items, mock]);
  const pageCount = getPageCount(dataSource.length, pageSize);
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const visibleItems = dataSource.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  React.useEffect(() => {
    return () => {
      if (loadingTimerRef.current !== null) {
        window.clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  const startLoadingTransition = () => {
    if (!mock) {
      return;
    }

    if (loadingTimerRef.current !== null) {
      window.clearTimeout(loadingTimerRef.current);
    }

    // mock 模式用短暂 Skeleton 还原接口请求等待，真实 items 由业务侧自行控制加载态。
    setLoading(true);
    loadingTimerRef.current = window.setTimeout(() => {
      setLoading(false);
      loadingTimerRef.current = null;
    }, loadingDuration);
  };

  const handleFormChange = (nextValue: FormValues) => {
    setFormValue(nextValue);

    if (mock && isMockFilledSearch(nextValue)) {
      setCurrentPage(1);
      startLoadingTransition();
    }
  };

  const handleSearchSubmit = (nextValue: FormValues) => {
    setFormValue(nextValue);
    setCurrentPage(1);
    startLoadingTransition();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    startLoadingTransition();
  };

  return (
    <section
      {...props}
      data-testid="card-grid-page-root"
      className={cn(
        'min-h-screen bg-secondary p-6 text-foreground dark:bg-background-dark dark:text-foreground-dark',
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl gap-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-surface p-6 shadow-button dark:border-border-dark dark:bg-surface-dark lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary dark:bg-primary-dark-soft dark:text-primary-dark">
              <Layers3 className="size-3.5" aria-hidden="true" />
              CARD GRID PAGE
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-normal text-foreground dark:text-foreground-dark">
              {title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
              {description}
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-sm font-medium text-muted-foreground dark:border-border-dark dark:bg-secondary-dark dark:text-muted-dark-foreground">
            <Search className="size-4" aria-hidden="true" />
            当前结果 {dataSource.length} 条
          </div>
        </header>

        <Card className="p-5">
          <Form
            schema={searchSchema}
            value={formValue}
            showMockFill
            onChange={handleFormChange}
            onSubmit={handleSearchSubmit}
            className="grid-cols-1 lg:grid-cols-4"
          />
        </Card>

        <div aria-live="polite">
          {loading ? (
            <CardGridSkeleton count={Math.min(pageSize, 6)} />
          ) : visibleItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((item) => (
                <CardGridItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card className="flex min-h-52 items-center justify-center p-6 text-center text-sm text-muted-foreground dark:text-muted-dark-foreground">
              暂无卡片数据
            </Card>
          )}
        </div>

        <Pagination
          total={dataSource.length}
          pageSize={pageSize}
          currentPage={safeCurrentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
}
