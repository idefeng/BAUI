import * as React from 'react';
import { BellRing, ShieldCheck, UserCog } from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockUsers, type BaBusinessProps } from '../../../utils/mock';
import { CertificateTemplate } from '../certificate';
import { LearningProfile } from '../profile';
import { Card } from '../../ui/card';
import { Form, type FormSchemaField, type FormValues } from '../../ui/form';

export interface AccountSettingsPageProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'>, BaBusinessProps {
  /** 页面标题，适合接入实际账号中心时替换。 */
  title?: React.ReactNode;
  /** 页面副标题，用于说明账号设置影响范围。 */
  description?: React.ReactNode;
}

const accountSettingsSchema: FormSchemaField[] = [
  { name: 'studentName', label: '学员姓名', type: 'input', placeholder: '请输入学员姓名', mock: 'name' },
  { name: 'phone', label: '联系电话', type: 'input', placeholder: '请输入联系电话', mock: 'phone' },
  { name: 'project', label: '培训项目', type: 'select', placeholder: '请选择培训项目', mock: 'project' },
  { name: 'trainingType', label: '培训类型', type: 'select', placeholder: '请选择培训类型', mock: 'trainingType' },
  { name: 'techDirections', label: '期望技能', type: 'checkbox', mock: true },
  { name: 'notificationEnabled', label: '学习提醒', type: 'switch' },
];

/** AccountSettingsPage 聚合账号资料、学习偏好和证书预览，作为业务账号中心模板。 */
export function AccountSettingsPage({
  ba_training_project,
  ba_trainning_title,
  ba_trainning_type,
  ba_region_scope,
  className,
  description = '统一维护学员资料、岗位技能偏好、学习提醒和证书展示，适合作为账号中心或个人设置页。',
  mock = false,
  title = '账号设置中心',
  ...props
}: AccountSettingsPageProps) {
  const businessProps = React.useMemo<BaBusinessProps>(
    () => ({ ba_training_project, ba_trainning_title, ba_trainning_type, ba_region_scope }),
    [ba_region_scope, ba_training_project, ba_trainning_title, ba_trainning_type],
  );
  const mockUser = React.useMemo(() => mockUsers(1, businessProps)[0], [businessProps]);
  const [formValue, setFormValue] = React.useState<FormValues>(() => ({
    studentName: mock ? mockUser.name : '',
    phone: mock ? mockUser.phoneMasked : '',
    project: ba_training_project ?? '',
    trainingType: ba_trainning_type ?? '',
    techDirections: [],
    notificationEnabled: true,
  }));

  React.useEffect(() => {
    if (!mock) {
      return;
    }

    // mock 属性变化时同步账号表单首屏值，保证 Storybook Controls 可以即时观察业务语义切换。
    setFormValue((currentValue) => ({
      ...currentValue,
      studentName: mockUser.name,
      phone: mockUser.phoneMasked,
      project: ba_training_project ?? '',
      trainingType: ba_trainning_type ?? '',
    }));
  }, [ba_training_project, ba_trainning_type, mock, mockUser]);

  return (
    <section
      {...props}
      data-testid="account-settings-page-root"
      className={cn('min-h-screen bg-secondary p-6 text-foreground dark:bg-background-dark dark:text-foreground-dark', className)}
    >
      <div className="mx-auto grid max-w-7xl gap-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-surface p-6 shadow-button dark:border-border-dark dark:bg-surface-dark lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary dark:bg-primary-dark-soft dark:text-primary-dark">
              <UserCog className="size-3.5" aria-hidden="true" />
              ACCOUNT SETTINGS
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-normal text-foreground dark:text-foreground-dark">
              {title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
              {description}
            </p>
          </div>
          <div className="grid gap-2 rounded-2xl border border-border bg-secondary px-4 py-3 text-sm dark:border-border-dark dark:bg-secondary-dark">
            <span className="inline-flex items-center gap-2 font-semibold text-foreground dark:text-foreground-dark">
              <ShieldCheck className="size-4 text-success dark:text-success-dark" aria-hidden="true" />
              {mockUser.projectName}
            </span>
            <span className="text-muted-foreground dark:text-muted-dark-foreground">{mockUser.jobTitle}</span>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <Card className="grid gap-5 p-5">
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark">资料与技能偏好</h3>
              <p className="mt-1 text-sm text-muted-foreground dark:text-muted-dark-foreground">
                AI 一键填表会依据当前业务属性生成项目、培训类型和岗位技能数据。
              </p>
            </div>
            <Form
              schema={accountSettingsSchema}
              value={formValue}
              {...businessProps}
              onChange={setFormValue}
            />
          </Card>

          <div className="grid gap-6">
            <Card className="grid gap-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground dark:text-foreground-dark">证书预览</h3>
                  <p className="mt-1 text-sm text-muted-foreground dark:text-muted-dark-foreground">
                    根据培训类型自动切换证书模板和证书指标。
                  </p>
                </div>
                <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark">
                  <BellRing className="size-5" aria-hidden="true" />
                </span>
              </div>
              <CertificateTemplate type="qualified" mock={mock} {...businessProps} showActions={false} />
            </Card>
          </div>
        </div>

        <LearningProfile studentId="account-settings-profile" mock={mock} {...businessProps} />
      </div>
    </section>
  );
}
