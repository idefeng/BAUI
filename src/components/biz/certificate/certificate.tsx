import * as React from 'react';
import { Printer } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockCertificate, type BaBusinessProps, type MockCertificateData, type MockCertificateType } from '../../../utils/mock';
import { Button } from '../../ui/button';

export type CertificateType = MockCertificateType;

export interface CertificateData extends MockCertificateData {}

export interface CertificateTemplateProps extends React.HTMLAttributes<HTMLDivElement>, BaBusinessProps {
  /** 证书类型：学时证明、培训合格证明或继续教育学分证书。 */
  type: CertificateType;
  /** 真实证书数据；当 mock=true 且未传 data 时会自动使用 mockCertificate(type)。 */
  data?: CertificateData;
  /** 是否自动生成高保真公司证书 mock 数据，真实 data 拥有更高优先级。 */
  mock?: boolean;
  /** 是否展示打印操作按钮。 */
  showActions?: boolean;
}

interface CertificateCopy {
  title: string;
  eyebrow: string;
  metricLabel: string;
  metricValue: (data: CertificateData) => string;
  statement: (data: CertificateData) => React.ReactNode;
}

const certificateCopy: Record<CertificateType, CertificateCopy> = {
  hours: {
    title: '学时证明',
    eyebrow: 'TRAINING HOURS CERTIFICATE',
    metricLabel: '累计学时',
    metricValue: (data) => `${data.hours ?? 0} 学时`,
    statement: (data) => (
      <>
        兹证明学员 <strong>{data.studentName}</strong> 已按要求完成
        <strong> {data.projectName}</strong> 相关课程学习，累计完成 <strong>{data.hours ?? 0} 学时</strong>。
      </>
    ),
  },
  qualified: {
    title: '培训合格证明',
    eyebrow: 'QUALIFICATION CERTIFICATE',
    metricLabel: '培训结论',
    metricValue: () => '成绩合格',
    statement: (data) => (
      <>
        兹证明学员 <strong>{data.studentName}</strong> 参加 <strong>{data.projectName}</strong>
        培训，经综合考核 <strong>成绩合格，特发此证</strong>。
      </>
    ),
  },
  education: {
    title: '继续教育学分证书',
    eyebrow: 'CONTINUING EDUCATION CREDIT CERTIFICATE',
    metricLabel: '授予学分',
    metricValue: (data) => `${data.credits ?? 0} 学分`,
    statement: (data) => (
      <>
        兹证明学员 <strong>{data.studentName}</strong> 完成 <strong>{data.courseName ?? data.projectName}</strong>
        学习任务，授予继续教育 <strong>{data.credits ?? 0} 学分</strong>。
      </>
    ),
  },
};

const emptyCertificateData: CertificateData = {
  studentName: '待录入学员',
  idCardMasked: '******************',
  projectName: '待录入项目',
  courseName: '待录入课程',
  hours: 0,
  credits: 0,
  certificateNo: '待生成',
  issuedAt: '待签发',
  organization: '博奥教育 (ETLCHINA)',
};

const CertificateInfoItem = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="space-y-1">
    <dt className="text-xs font-medium uppercase text-muted-foreground dark:text-slate-400">{label}</dt>
    <dd className="min-h-6 border-b border-dashed border-border pb-1 text-sm font-semibold text-foreground dark:border-slate-600 dark:text-slate-100">
      {value || '-'}
    </dd>
  </div>
);

/** CertificateTemplate 公司专属证书模板，支持真实数据和 mock 数据两种模式。 */
export function CertificateTemplate({
  ba_training_project,
  ba_trainning_title,
  ba_trainning_type,
  ba_region_scope,
  className,
  data,
  mock = false,
  showActions = true,
  type,
  ...props
}: CertificateTemplateProps) {
  const businessProps = React.useMemo<BaBusinessProps>(
    () => ({ ba_training_project, ba_trainning_title, ba_trainning_type, ba_region_scope }),
    [ba_region_scope, ba_training_project, ba_trainning_title, ba_trainning_type],
  );
  const certificateData = data ?? (mock ? mockCertificate(type, businessProps) : emptyCertificateData);
  const effectiveType = data ? type : certificateData.certificateType ?? type;
  const content = certificateCopy[effectiveType];

  const handlePrint = () => {
    // 使用浏览器原生打印，交给业务侧或用户选择保存为 PDF。
    window.print();
  };

  return (
    <div className={cn('relative mx-auto w-full max-w-5xl', className)} {...props}>
      {showActions ? (
        <div className="absolute right-4 top-4 z-20 print:hidden">
          <Button size="sm" leftIcon={<Printer />} onClick={handlePrint}>
            打印证书
          </Button>
        </div>
      ) : null}

      <article
        role="article"
        aria-label={content.title}
        data-testid="certificate-paper"
        className={cn(
          'relative isolate min-h-[640px] overflow-hidden rounded-2xl border-[10px] border-double border-amber-300/70 bg-gradient-to-br from-white via-amber-50/80 to-sky-50 px-10 py-12 text-foreground shadow-xl',
          'dark:border-amber-200/40 dark:bg-slate-950 dark:bg-none dark:text-slate-100 dark:shadow-[0_30px_80px_-40px_rgb(251_191_36_/_0.55)]',
        )}
      >
        <div className="absolute inset-5 rounded-xl border border-amber-200/70 dark:border-amber-200/25" data-testid="certificate-inner-border" />
        <div className="absolute inset-10 rounded-lg border border-sky-200/60 dark:border-slate-500/40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 -rotate-12 select-none text-center text-6xl font-black tracking-[0.32em] text-primary/5 dark:text-amber-200/10">
          博奥教育 (ETLCHINA)
        </div>
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(0,82,217,0.11),transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.18),transparent_34%)]" />

        <div className="relative z-10 flex min-h-[540px] flex-col">
          <header className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-primary dark:text-amber-200">{content.eyebrow}</p>
            <h2 className="mt-5 text-4xl font-black tracking-[0.18em] text-foreground dark:text-amber-100">{content.title}</h2>
            <div className="mx-auto mt-5 h-px w-64 bg-gradient-to-r from-transparent via-amber-400 to-transparent dark:via-amber-200/70" />
          </header>

          <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_13rem]">
            <div className="space-y-8">
              <p className="text-lg leading-10 text-foreground dark:text-slate-100 [&_strong]:font-black [&_strong]:text-primary dark:[&_strong]:text-amber-100">
                {content.statement(certificateData)}
              </p>
              <dl className="grid gap-5 sm:grid-cols-2">
                <CertificateInfoItem label="学员姓名" value={certificateData.studentName} />
                <CertificateInfoItem label="身份证号" value={certificateData.idCardMasked} />
                <CertificateInfoItem label="项目/课程名称" value={certificateData.courseName ?? certificateData.projectName} />
                <CertificateInfoItem label="证书编号" value={certificateData.certificateNo} />
              </dl>
            </div>

            <aside className="rounded-2xl border border-amber-200/70 bg-white/60 p-5 text-center shadow-button backdrop-blur dark:border-amber-200/25 dark:bg-slate-900/70">
              <p className="text-xs font-medium text-muted-foreground dark:text-slate-400">{content.metricLabel}</p>
              <p className="mt-3 text-3xl font-black text-primary dark:text-amber-100">{content.metricValue(certificateData)}</p>
              <div className="mt-6 grid aspect-square grid-cols-5 gap-1 rounded-xl border border-border bg-white p-3 dark:border-slate-600 dark:bg-slate-950">
                {Array.from({ length: 25 }, (_, index) => (
                  <span
                    key={index}
                    className={cn(
                      'rounded-sm',
                      index % 3 === 0 || index === 6 || index === 18 ? 'bg-foreground dark:bg-amber-100' : 'bg-muted dark:bg-slate-700',
                    )}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground dark:text-slate-400">防伪校验</p>
            </aside>
          </section>

          <footer className="mt-auto grid gap-8 pt-10 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <div className="space-y-2 text-sm text-muted-foreground dark:text-slate-400">
              <p>发证单位：{certificateData.organization ?? '博奥教育 (ETLCHINA)'}</p>
              <p>发证日期：{certificateData.issuedAt}</p>
            </div>
            <div
              aria-label="博奥教育 (ETLCHINA) 电子印章"
              className="relative flex size-28 items-center justify-center rounded-full border-[6px] border-red-600 text-center text-[11px] font-black leading-4 text-red-600 opacity-90 dark:border-red-400 dark:text-red-300"
            >
              <span className="absolute inset-3 rounded-full border border-red-600/70 dark:border-red-300/70" />
              <span className="relative px-2">
                博奥教育
                <br />
                (ETLCHINA)
              </span>
            </div>
            <div className="text-right text-xs uppercase tracking-[0.22em] text-muted-foreground dark:text-slate-500">
              ETLCHINA Training
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
}
