import * as React from 'react';
import { Award, BookOpen, CalendarDays, CheckCircle2, Clock, GraduationCap } from 'lucide-react';

import { cn } from '../../../lib/utils';
import {
  mockLearningProfile,
  type MockLearningCourseStatus,
  type MockLearningProfileCourse,
  type MockLearningProfileData,
  type MockLearningProfileTimelineEvent,
} from '../../../utils/mock';
import { Button } from '../../ui/button';
import { Modal, ModalContent, ModalTitle } from '../../ui/modal';
import { Skeleton } from '../../ui/skeleton';
import { SmartTable, type SmartTableColumn } from '../smart-table';
import { CertificateTemplate } from '../certificate';

export interface LearningProfileProps extends React.HTMLAttributes<HTMLElement> {
  /** 学员 ID，用于 mock 数据生成时保持外部业务主键一致。 */
  studentId?: string;
  /** 是否启用 600ms 全局骨架屏并自动灌入高保真学习轨迹数据。 */
  mock?: boolean;
}

interface SummaryCard {
  id: keyof MockLearningProfileData['summary'];
  label: string;
  value: number;
  suffix: string;
  icon: React.ReactNode;
}

const statusClassNames: Record<MockLearningCourseStatus, string> = {
  已完成: 'bg-success-soft text-success dark:bg-success-dark-soft dark:text-success-dark',
  进行中: 'bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark',
  待开始: 'bg-secondary text-muted-foreground dark:bg-secondary-dark dark:text-muted-dark-foreground',
};

const timelineIconClassNames: Record<MockLearningProfileTimelineEvent['type'], string> = {
  joined: 'bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark',
  course: 'bg-secondary text-muted-foreground dark:bg-secondary-dark dark:text-muted-dark-foreground',
  exam: 'bg-success-soft text-success dark:bg-success-dark-soft dark:text-success-dark',
  certificate: 'bg-primary text-primary-foreground dark:bg-primary-dark dark:text-primary-dark-foreground',
};

const formatDate = (date: string) => {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return `${parsedDate.getFullYear()}年${parsedDate.getMonth() + 1}月${parsedDate.getDate()}日`;
};

const createCourseColumns = (): SmartTableColumn<MockLearningProfileCourse>[] => [
  {
    key: 'courseName',
    title: '课程名',
    dataIndex: 'courseName',
    ellipsis: true,
    width: 220,
    render: (value) => <span className="font-medium text-foreground dark:text-foreground-dark">{value as React.ReactNode}</span>,
  },
  {
    key: 'hours',
    title: '学时',
    dataIndex: 'hours',
    width: 96,
    align: 'right',
    render: (value) => `${value} 学时`,
  },
  {
    key: 'credits',
    title: '学分',
    dataIndex: 'credits',
    width: 96,
    align: 'right',
    render: (value) => `${value} 学分`,
  },
  {
    key: 'examResult',
    title: '考核结果',
    dataIndex: 'examResult',
    width: 110,
  },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    width: 110,
    render: (value) => {
      const status = value as MockLearningCourseStatus;

      return (
        <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-medium', statusClassNames[status])}>
          {status}
        </span>
      );
    },
  },
  {
    key: 'completedAt',
    title: '完成时间',
    dataIndex: 'completedAt',
    width: 132,
    align: 'right',
  },
];

const LearningProfileSkeleton = ({ className }: { className?: string }) => (
  <section
    data-testid="learning-profile-skeleton"
    className={cn(
      'grid gap-6 rounded-3xl border border-border bg-surface p-5 shadow-button dark:border-border-dark dark:bg-surface-dark',
      className,
    )}
  >
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="rounded-3xl border border-border bg-secondary p-5 dark:border-border-dark dark:bg-secondary-dark">
          <Skeleton className="size-11 rounded-2xl" />
          <Skeleton className="mt-5 h-7 w-20" />
          <Skeleton className="mt-3 h-4 w-28" />
        </div>
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
      <div className="space-y-4 rounded-3xl border border-border p-5 dark:border-border-dark">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="grid grid-cols-[5rem_1fr] gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-border p-5 dark:border-border-dark">
        <Skeleton className="h-7 w-56" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-12 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  </section>
);

/** LearningProfile 综合性学习档案，把学习摘要、成长时间线和历史课程表格聚合展示。 */
export function LearningProfile({
  className,
  mock = false,
  studentId = 'student-it-001',
  ...props
}: LearningProfileProps) {
  const [profile, setProfile] = React.useState<MockLearningProfileData | null>(() =>
    mock ? null : mockLearningProfile(studentId),
  );
  const [loading, setLoading] = React.useState(mock);
  const [selectedCertificateEvent, setSelectedCertificateEvent] =
    React.useState<MockLearningProfileTimelineEvent | null>(null);

  React.useEffect(() => {
    if (!mock) {
      setProfile(mockLearningProfile(studentId));
      setLoading(false);
      return;
    }

    setProfile(null);
    setLoading(true);

    const timer = window.setTimeout(() => {
      // mock 模式使用一次性灌入，便于 Storybook 观察全局骨架屏到真实数据的切换。
      setProfile(mockLearningProfile(studentId));
      setLoading(false);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [mock, studentId]);

  const courseColumns = React.useMemo(() => createCourseColumns(), []);
  const summaryCards = React.useMemo<SummaryCard[]>(() => {
    if (!profile) {
      return [];
    }

    return [
      { id: 'totalHours', label: '总已学学时', value: profile.summary.totalHours, suffix: '学时', icon: <Clock /> },
      { id: 'certificateCount', label: '已获证书', value: profile.summary.certificateCount, suffix: '张', icon: <Award /> },
      { id: 'activeCourseCount', label: '进行中课程', value: profile.summary.activeCourseCount, suffix: '门', icon: <BookOpen /> },
      { id: 'annualCredits', label: '年度学分', value: profile.summary.annualCredits, suffix: '学分', icon: <GraduationCap /> },
    ];
  }, [profile]);

  if (loading || !profile) {
    return <LearningProfileSkeleton className={className} />;
  }

  return (
    <section
      data-testid="learning-profile-root"
      className={cn(
        'grid gap-6 rounded-3xl border border-border bg-background p-5 text-foreground shadow-button dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark',
        className,
      )}
      {...props}
    >
      <header className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-5 dark:border-border-dark dark:bg-surface-dark lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground dark:text-muted-dark-foreground">综合学习档案</p>
          <div className="flex flex-wrap items-end gap-3">
            <h2 className="text-2xl font-bold tracking-normal text-foreground dark:text-foreground-dark">{profile.student.name}</h2>
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary dark:bg-primary-dark-soft dark:text-primary-dark">
              {profile.student.jobTitle}
            </span>
          </div>
          <p className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
            {profile.student.workUnit} · {profile.student.idCardMasked}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-sm text-muted-foreground dark:border-border-dark dark:bg-secondary-dark dark:text-muted-dark-foreground">
          <CalendarDays className="size-4" aria-hidden="true" />
          入学时间：{formatDate(profile.student.joinedAt)}
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.id}
            data-testid={`learning-profile-summary-card-${card.id}`}
            className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-secondary to-primary-soft p-5 shadow-button dark:border-border-dark dark:from-surface-dark dark:via-secondary-dark dark:to-primary-dark-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-surface p-3 text-primary shadow-button dark:bg-surface-dark dark:text-primary-dark [&>svg]:size-5">
                {card.icon}
              </div>
              <span className="rounded-full bg-surface/80 px-3 py-1 text-xs font-medium text-muted-foreground dark:bg-surface-dark/80 dark:text-muted-dark-foreground">
                {card.suffix}
              </span>
            </div>
            <p className="mt-5 text-3xl font-black text-foreground dark:text-foreground-dark">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground dark:text-muted-dark-foreground">{card.label}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <section className="rounded-3xl border border-border bg-surface p-5 shadow-button dark:border-border-dark dark:bg-surface-dark">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark">Learning Timeline</h3>
              <p className="mt-1 text-sm text-muted-foreground dark:text-muted-dark-foreground">关键学习节点与证书留痕</p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground dark:bg-secondary-dark dark:text-muted-dark-foreground">
              {profile.timeline.length} 个节点
            </span>
          </div>

          <ol className="relative space-y-5 before:absolute before:left-[5.2rem] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border dark:before:bg-border-dark">
            {profile.timeline.map((event) => {
              const canPreviewCertificate = event.type === 'certificate' && event.certificateType && event.certificateData;

              return (
                <li
                  key={event.id}
                  data-testid={
                    canPreviewCertificate
                      ? `learning-profile-timeline-event-certificate-${event.certificateType}`
                      : `learning-profile-timeline-event-${event.type}`
                  }
                  className="relative grid grid-cols-[4.4rem_1fr] gap-5"
                >
                  <time className="pt-2 text-xs font-medium text-muted-foreground dark:text-muted-dark-foreground">
                    {event.date.slice(5)}
                  </time>
                  <div className="relative rounded-3xl border border-border bg-background p-4 dark:border-border-dark dark:bg-background-dark">
                    <span
                      className={cn(
                        'absolute -left-[2.15rem] top-4 flex size-8 items-center justify-center rounded-full border-4 border-surface dark:border-surface-dark [&>svg]:size-4',
                        timelineIconClassNames[event.type],
                      )}
                    >
                      {event.type === 'certificate' ? (
                        <Award aria-hidden="true" />
                      ) : event.type === 'exam' ? (
                        <CheckCircle2 aria-hidden="true" />
                      ) : (
                        <BookOpen aria-hidden="true" />
                      )}
                    </span>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground dark:text-foreground-dark">{event.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
                          {event.description}
                        </p>
                      </div>
                      {canPreviewCertificate ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="self-start"
                          onClick={() => setSelectedCertificateEvent(event)}
                        >
                          查看证书
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="min-w-0 rounded-3xl border border-border bg-surface p-5 shadow-button dark:border-border-dark dark:bg-surface-dark">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark">历史课程修读明细清单</h3>
              <p className="mt-1 text-sm text-muted-foreground dark:text-muted-dark-foreground">
                复用 SmartTable 展示课程、学时、考核结果与状态
              </p>
            </div>
            <span className="text-sm text-muted-foreground dark:text-muted-dark-foreground">
              共 {profile.courses.length} 门课程
            </span>
          </div>
          <SmartTable<MockLearningProfileCourse>
            columns={courseColumns}
            data={profile.courses}
            rowKey="id"
            searchable={false}
            maxBodyHeight={420}
            className="rounded-3xl shadow-none"
            emptyText="暂无课程修读记录"
          />
        </section>
      </div>

      <Modal
        open={Boolean(selectedCertificateEvent)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCertificateEvent(null);
          }
        }}
      >
        <ModalContent className="max-h-[92vh] max-w-6xl overflow-y-auto p-4 sm:p-6">
          <ModalTitle>证书预览</ModalTitle>
          {selectedCertificateEvent?.certificateType && selectedCertificateEvent.certificateData ? (
            <CertificateTemplate
              type={selectedCertificateEvent.certificateType}
              data={selectedCertificateEvent.certificateData}
              showActions={false}
            />
          ) : null}
        </ModalContent>
      </Modal>
    </section>
  );
}

LearningProfile.displayName = 'LearningProfile';
