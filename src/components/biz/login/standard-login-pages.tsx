import * as React from 'react';
import {
  BookOpenCheck,
  CheckCircle2,
  CloudSun,
  GraduationCap,
  KeyRound,
  LockKeyhole,
  MonitorCog,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';

import { cn } from '../../../lib/utils';
import { mockLoginAccount, type MockLoginRole } from '../../../utils/mock';
import { Badge } from '../../ui/badge';
import { BrandBackground, BrandLogo } from '../../ui/branding';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Carousel, type CarouselSlide } from '../../ui/carousel';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Statistic } from '../../ui/statistic';
import { Switch } from '../../ui/switch';
import { ThemeToggle } from '../../ui/theme-toggle';

export type StandardLoginPageType = 'tech' | 'education' | 'minimal' | 'split-screen' | 'classic' | 'otp';
export type StandardLoginRole = 'student' | 'teacher' | 'academic-admin';

export interface StandardLoginPagesSubmitValues {
  username: string;
  password: string;
  role?: StandardLoginRole;
  /** `type="otp"` 免密登录时回传的手机号或邮箱。 */
  contact?: string;
  /** `type="otp"` 免密登录时回传的一次性验证码。 */
  otp?: string;
}

export interface StandardLoginPagesProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  /** 登录页模板风格，用于切换行业门面与表单组合。 */
  type?: StandardLoginPageType;
  /** 表单校验通过后触发，只返回登录所需的安全字段。 */
  onSubmit: (values: StandardLoginPagesSubmitValues) => void;
  /** 开启后展示 AI 一键填表，并从中央 mock 数据源填入演示账号。 */
  mock?: boolean;
}

interface LoginFormState {
  username: string;
  password: string;
  role: StandardLoginRole;
  captcha: string;
  remember: boolean;
}

type LoginFormErrors = Partial<Record<'username' | 'password' | 'role' | 'captcha', string>>;
type LoginFormTone = Exclude<StandardLoginPageType, 'otp'>;

interface LoginFormProps {
  tone: LoginFormTone;
  title: string;
  description: string;
  buttonText: string;
  mock: boolean;
  showRole?: boolean;
  showCaptcha?: boolean;
  onSubmit: StandardLoginPagesProps['onSubmit'];
}

interface LoginFormToneStyles {
  panel: string;
  title: string;
  description: string;
  label: string;
  inputRoot: string;
  input: string;
  selectTrigger: string;
  error: string;
  remember: string;
  submitButton: string;
  mockButton: string;
}

const roleOptions: Array<{ label: string; value: StandardLoginRole }> = [
  { label: '学员登录', value: 'student' },
  { label: '讲师登录', value: 'teacher' },
  { label: '教务管理员', value: 'academic-admin' },
];

const initialFormValue: LoginFormState = {
  username: '',
  password: '',
  role: 'student',
  captcha: '',
  remember: false,
};

const captchaCode = 'ET26';
const otpLength = 6;
const mockOtp = '202626';

const templateCopy: Record<LoginFormTone, { title: string; description: string; buttonText: string }> = {
  tech: {
    title: '云平台统一身份登录',
    description: '进入智能培训、资源调度与内控审计一体化控制台。',
    buttonText: '登录控制台',
  },
  education: {
    title: '博奥教育学堂',
    description: '连接学员、讲师与教务协同的在线学习工作台。',
    buttonText: '进入学堂',
  },
  minimal: {
    title: '登录',
    description: '进入你的知识库与协作空间。',
    buttonText: '登录',
  },
  'split-screen': {
    title: '企业学习中台',
    description: '统一管理集团培训、证书、学分和项目运营数据。',
    buttonText: '登录系统',
  },
  classic: {
    title: '安全身份认证',
    description: '继续教育学分管理与严肃考核系统入口。',
    buttonText: '安全登录',
  },
};

const toneStyles: Record<LoginFormTone, LoginFormToneStyles> = {
  tech: {
    panel:
      'w-full max-w-md border-white/20 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md dark:border-white/20 dark:bg-white/10',
    title: 'text-white',
    description: 'text-blue-100/80',
    label: 'text-blue-50',
    inputRoot:
      'border-white/20 bg-white/10 text-white shadow-none focus-within:border-sky-300 focus-within:ring-sky-300/40 focus-within:ring-offset-transparent dark:border-white/20 dark:bg-white/10 dark:focus-within:border-sky-300 dark:focus-within:ring-sky-300/40 dark:focus-within:ring-offset-transparent',
    input: 'text-white placeholder:text-blue-100/70 dark:text-white dark:placeholder:text-blue-100/70',
    selectTrigger: '',
    error: 'text-sky-100',
    remember: 'text-blue-100/85',
    submitButton:
      'bg-sky-300 text-slate-950 shadow-button hover:bg-sky-200 active:bg-sky-300 dark:bg-sky-300 dark:text-slate-950 dark:hover:bg-sky-200 dark:active:bg-sky-300',
    mockButton:
      'border-white/20 bg-white/10 text-white hover:bg-white/15 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/15',
  },
  education: {
    panel:
      'w-full max-w-md border-warning/20 bg-warning-soft/90 p-6 shadow-button backdrop-blur dark:border-border-dark dark:bg-surface-dark',
    title: 'text-foreground dark:text-foreground-dark',
    description: 'text-muted-foreground dark:text-muted-dark-foreground',
    label: 'text-foreground dark:text-foreground-dark',
    inputRoot: '',
    input: '',
    selectTrigger: '',
    error: 'text-danger dark:text-danger-dark',
    remember: 'text-muted-foreground dark:text-muted-dark-foreground',
    submitButton:
      'bg-warning text-warning-foreground hover:bg-warning-hover active:bg-warning-active dark:bg-warning-dark dark:text-warning-dark-foreground dark:hover:bg-warning-dark-hover dark:active:bg-warning-dark-active',
    mockButton: '',
  },
  minimal: {
    panel: 'w-full max-w-sm border-0 bg-transparent p-0 shadow-none dark:bg-transparent',
    title: 'text-foreground dark:text-foreground-dark',
    description: 'text-muted-foreground dark:text-muted-dark-foreground',
    label: 'text-foreground dark:text-foreground-dark',
    inputRoot:
      'h-12 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-within:border-foreground focus-within:ring-0 focus-within:ring-offset-0 dark:border-border-dark dark:bg-transparent dark:focus-within:border-foreground-dark',
    input: 'text-base',
    selectTrigger: '',
    error: 'text-danger dark:text-danger-dark',
    remember: 'text-muted-foreground dark:text-muted-dark-foreground',
    submitButton:
      'bg-foreground text-background transition-transform duration-300 hover:scale-[1.02] hover:bg-foreground active:scale-[0.99] dark:bg-foreground-dark dark:text-background-dark dark:hover:bg-foreground-dark',
    mockButton:
      'border-border bg-transparent text-foreground shadow-none hover:bg-secondary dark:border-border-dark dark:text-foreground-dark dark:hover:bg-secondary-dark',
  },
  'split-screen': {
    panel: 'w-full max-w-md border-0 bg-transparent p-0 shadow-none dark:bg-transparent',
    title: 'text-foreground dark:text-foreground-dark',
    description: 'text-muted-foreground dark:text-muted-dark-foreground',
    label: 'text-foreground dark:text-foreground-dark',
    inputRoot: '',
    input: '',
    selectTrigger: '',
    error: 'text-danger dark:text-danger-dark',
    remember: 'text-muted-foreground dark:text-muted-dark-foreground',
    submitButton: '',
    mockButton: '',
  },
  classic: {
    panel:
      'w-full max-w-md border-2 border-border-strong bg-surface p-6 shadow-button ring-4 ring-secondary dark:border-border-dark-strong dark:bg-surface-dark dark:ring-secondary-dark',
    title: 'text-foreground dark:text-foreground-dark',
    description: 'text-muted-foreground dark:text-muted-dark-foreground',
    label: 'text-foreground dark:text-foreground-dark',
    inputRoot: 'rounded-lg',
    input: '',
    selectTrigger: '',
    error: 'text-danger dark:text-danger-dark',
    remember: 'text-muted-foreground dark:text-muted-dark-foreground',
    submitButton: '',
    mockButton: '',
  },
};

const educationSlides: CarouselSlide[] = [
  {
    id: 'excellent-students',
    eyebrow: '年度专题',
    title: '2026年度优秀学员风采',
    description: '沉淀职业培训、继续教育与专项能力提升的真实成长样本。',
  },
  {
    id: 'teacherware',
    eyebrow: '教研推荐',
    title: '名师课件推荐',
    description: '围绕岗位胜任力，把课程、训练、考核和证书串成闭环。',
  },
  {
    id: 'live-class',
    eyebrow: '直播课堂',
    title: '本周精品公开课',
    description: '支持学员随到随学，讲师与教务实时协同管理学习进度。',
  },
];

const updateErrors = (errors: LoginFormErrors, field: keyof LoginFormErrors): LoginFormErrors => {
  if (!errors[field]) {
    return errors;
  }

  const nextErrors = { ...errors };
  delete nextErrors[field];

  return nextErrors;
};

const isStandardLoginRole = (role: MockLoginRole | undefined): role is StandardLoginRole =>
  role === 'student' || role === 'teacher' || role === 'academic-admin';

const createEmptyOtp = () => Array.from({ length: otpLength }, () => '');

const createMockContact = () => `${mockLoginAccount('student').username}@etlchina.com`;

/** 将任意输入收敛为单个数字字符，避免验证码格子里出现多字符状态。 */
const normalizeOtpDigit = (value: string) => value.replace(/\D/g, '').slice(-1);

const getPanelIcon = (tone: LoginFormTone) => {
  if (tone === 'education') {
    return <GraduationCap />;
  }

  if (tone === 'classic') {
    return <ShieldCheck />;
  }

  if (tone === 'minimal') {
    return <Sparkles />;
  }

  return <MonitorCog />;
};

function LoginFormPanel({
  buttonText,
  description,
  mock,
  onSubmit,
  showCaptcha = false,
  showRole = false,
  title,
  tone,
}: LoginFormProps) {
  const idPrefix = React.useId().replace(/:/g, '');
  const styles = toneStyles[tone];
  const [formValue, setFormValue] = React.useState<LoginFormState>(initialFormValue);
  const [errors, setErrors] = React.useState<LoginFormErrors>({});

  const updateField = <Field extends keyof LoginFormState>(field: Field, value: LoginFormState[Field]) => {
    setFormValue((current) => ({
      ...current,
      [field]: value,
    }));
    setErrors((current) => updateErrors(current, field as keyof LoginFormErrors));
  };

  const fillMockValues = () => {
    const accountRole: MockLoginRole = showRole ? formValue.role : 'admin';
    const account = mockLoginAccount(accountRole);

    // mock 登录只作为外部未接入真实账号时的开发兜底，真实输入始终由用户字段覆盖。
    setFormValue((current) => ({
      ...current,
      username: account.username,
      password: account.password,
      role: showRole && isStandardLoginRole(account.role) ? account.role : current.role,
      captcha: showCaptcha ? captchaCode : current.captcha,
    }));
    setErrors({});
  };

  const validateForm = () => {
    const nextErrors: LoginFormErrors = {};

    if (formValue.username.trim().length === 0) {
      nextErrors.username = '请输入账号';
    }

    if (formValue.password.length === 0) {
      nextErrors.password = '请输入密码';
    }

    if (showRole && formValue.role.length === 0) {
      nextErrors.role = '请选择登录角色';
    }

    if (showCaptcha && formValue.captcha.trim().length === 0) {
      nextErrors.captcha = '请输入图形验证码';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      username: formValue.username.trim(),
      password: formValue.password,
      ...(showRole ? { role: formValue.role } : {}),
    });
  };

  const panelContent = (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <div className="flex justify-center">
        <BrandLogo
          data-testid="standard-login-brand-logo"
          variant="full"
          size="md"
          className={cn(tone === 'tech' && 'text-white dark:text-white')}
        />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <span className={cn('inline-flex size-11 items-center justify-center rounded-2xl [&>svg]:size-5', tone === 'tech' ? 'bg-white/10 text-sky-200' : 'bg-primary-soft text-primary dark:bg-primary-dark-soft dark:text-primary-dark')}>
            {getPanelIcon(tone)}
          </span>
          <div>
            <h2 className={cn('text-2xl font-bold tracking-normal', styles.title)}>{title}</h2>
            <p className={cn('mt-2 text-sm leading-6', styles.description)}>{description}</p>
          </div>
        </div>

        {mock ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={cn('shrink-0', styles.mockButton)}
            onClick={fillMockValues}
          >
            🌟 AI 一键填表
          </Button>
        ) : null}
      </div>

      {showRole ? (
        <div className="grid gap-2">
          <label htmlFor={`${idPrefix}-role`} className={cn('text-sm font-medium', styles.label)}>
            登录角色
          </label>
          <Select value={formValue.role} onValueChange={(value) => updateField('role', value as StandardLoginRole)}>
            <SelectTrigger
              id={`${idPrefix}-role`}
              aria-label="登录角色"
              className={cn(styles.selectTrigger, errors.role && 'border-danger dark:border-danger-dark')}
            >
              <SelectValue placeholder="请选择登录角色" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.role ? <p className={cn('text-xs font-medium', styles.error)}>{errors.role}</p> : null}
        </div>
      ) : null}

      <div className="grid gap-2">
        <label htmlFor={`${idPrefix}-username`} className={cn('text-sm font-medium', styles.label)}>
          登录账号
        </label>
        <Input
          id={`${idPrefix}-username`}
          name="username"
          value={formValue.username}
          placeholder="请输入账号、手机号或工号"
          autoComplete="username"
          prefixIcon={<UserRound />}
          rootClassName={cn(styles.inputRoot, errors.username && 'border-danger dark:border-danger-dark')}
          className={styles.input}
          onChange={(event) => updateField('username', event.currentTarget.value)}
        />
        {errors.username ? <p className={cn('text-xs font-medium', styles.error)}>{errors.username}</p> : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor={`${idPrefix}-password`} className={cn('text-sm font-medium', styles.label)}>
          登录密码
        </label>
        <Input
          id={`${idPrefix}-password`}
          name="password"
          type="password"
          value={formValue.password}
          placeholder="请输入登录密码"
          autoComplete="current-password"
          prefixIcon={<LockKeyhole />}
          rootClassName={cn(styles.inputRoot, errors.password && 'border-danger dark:border-danger-dark')}
          className={styles.input}
          onChange={(event) => updateField('password', event.currentTarget.value)}
        />
        {errors.password ? <p className={cn('text-xs font-medium', styles.error)}>{errors.password}</p> : null}
      </div>

      {showCaptcha ? (
        <div className="grid gap-2">
          <label htmlFor={`${idPrefix}-captcha`} className={cn('text-sm font-medium', styles.label)}>
            图形验证码
          </label>
          <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-3">
            <Input
              id={`${idPrefix}-captcha`}
              name="captcha"
              value={formValue.captcha}
              placeholder="请输入验证码"
              prefixIcon={<KeyRound />}
              suffixIcon={<ShieldCheck />}
              rootClassName={cn(styles.inputRoot, errors.captcha && 'border-danger dark:border-danger-dark')}
              className={styles.input}
              onChange={(event) => updateField('captcha', event.currentTarget.value)}
            />
            <div
              aria-label="图形验证码图片"
              className="flex h-11 select-none items-center justify-center rounded-lg border border-border bg-secondary text-base font-bold tracking-normal text-foreground shadow-sm dark:border-border-dark dark:bg-secondary-dark dark:text-foreground-dark"
            >
              {captchaCode}
            </div>
          </div>
          {errors.captcha ? <p className={cn('text-xs font-medium', styles.error)}>{errors.captcha}</p> : null}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor={`${idPrefix}-remember`}
          className={cn('flex min-w-0 items-center gap-3 text-sm', styles.remember)}
        >
          <Switch
            id={`${idPrefix}-remember`}
            checked={formValue.remember}
            onChange={(checked) => updateField('remember', checked)}
          />
          <span>保持登录状态</span>
        </label>
        <button type="button" className={cn('text-sm font-medium', tone === 'tech' ? 'text-sky-200 hover:text-white' : 'text-primary hover:text-primary-hover dark:text-primary-dark dark:hover:text-primary-dark-hover')}>
          忘记密码
        </button>
      </div>

      <Button type="submit" size="lg" fullWidth className={styles.submitButton}>
        {buttonText}
      </Button>
    </form>
  );

  if (tone === 'minimal' || tone === 'split-screen') {
    return <section className={cn(styles.panel)}>{panelContent}</section>;
  }

  return <Card className={styles.panel}>{panelContent}</Card>;
}

function OtpLoginVisualPanel() {
  return (
    <div
      data-testid="standard-login-otp-visual-panel"
      className="relative hidden min-h-[34rem] overflow-hidden bg-gradient-to-br from-success via-primary to-warning text-success-foreground lg:block"
    >
      <div className="absolute inset-0 bg-foreground/10" aria-hidden="true" />
      <div className="absolute inset-x-8 top-10 flex items-center justify-between text-success-foreground/85" aria-hidden="true">
        <CloudSun className="size-14" />
        <span className="h-px w-36 bg-success-foreground/40" />
      </div>

      <div className="absolute inset-x-10 bottom-24 h-56" aria-hidden="true">
        <span className="absolute bottom-0 left-1/2 h-32 w-64 -translate-x-1/2 rounded-t-full bg-surface/75 shadow-button dark:bg-surface-dark/75" />
        <span className="absolute bottom-0 left-1/2 h-20 w-40 -translate-x-1/2 rounded-t-full bg-success-foreground/25" />
        <span className="absolute bottom-0 left-[22%] h-44 w-7 rounded-t-full bg-surface/75 dark:bg-surface-dark/75" />
        <span className="absolute bottom-0 right-[22%] h-44 w-7 rounded-t-full bg-surface/75 dark:bg-surface-dark/75" />
        <span className="absolute bottom-36 left-[21%] size-10 rounded-full bg-warning-soft/80 dark:bg-warning-dark-soft/80" />
        <span className="absolute bottom-36 right-[21%] size-10 rounded-full bg-warning-soft/80 dark:bg-warning-dark-soft/80" />
        <span className="absolute bottom-0 left-10 right-10 h-10 rounded-t-full bg-success-foreground/20" />
      </div>

      <div className="absolute inset-x-8 top-32">
        <Badge className="border-success-foreground/20 bg-success-foreground/15 px-3 py-1 text-success-foreground">
          云端学习中心
        </Badge>
      </div>

      <div className="absolute inset-x-8 bottom-8 rounded-2xl bg-background/15 p-5 text-success-foreground shadow-button backdrop-blur-md dark:bg-background-dark/25">
        <p className="text-base font-semibold leading-7">持续学习，让每一次登录都通向新的能力。</p>
        <p className="mt-3 text-right text-xs text-success-foreground/75">— ETLCHINA 学习服务</p>
      </div>
    </div>
  );
}

function OtpLoginPage({
  className,
  mock,
  onSubmit,
  rootProps,
}: {
  className?: string;
  mock: boolean;
  onSubmit: StandardLoginPagesProps['onSubmit'];
  rootProps: React.HTMLAttributes<HTMLDivElement> & {
    'data-testid': string;
    'data-template': StandardLoginPageType;
  };
}) {
  const contactId = React.useId();
  const [contact, setContact] = React.useState(() => (mock ? createMockContact() : ''));
  const [otp, setOtp] = React.useState(() => (mock ? mockOtp.split('') : createEmptyOtp()));
  const otpRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const handleOtpChange = (index: number, value: string) => {
    const nextDigit = normalizeOtpDigit(value);

    setOtp((currentOtp) => currentOtp.map((digit, digitIndex) => (digitIndex === index ? nextDigit : digit)));

    // 输入后自动进入下一格，保留 OTP 分格录入的高效体验。
    if (nextDigit && index < otpLength - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedContact = contact.trim();

    onSubmit({
      username: normalizedContact,
      password: '',
      contact: normalizedContact,
      otp: otp.join(''),
    });
  };

  return (
    <div
      {...rootProps}
      className={cn('min-h-screen bg-secondary p-4 text-foreground dark:bg-background-dark dark:text-foreground-dark md:p-8', className)}
    >
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center md:min-h-[calc(100vh-4rem)]">
        <div className="grid w-full overflow-hidden rounded-3xl bg-surface shadow-button dark:bg-surface-dark lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <div className="flex min-h-[34rem] flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="mb-10 flex items-center justify-between gap-4">
              <BrandLogo variant="icon" size="sm" />
              <Badge variant="success" className="rounded-full px-3 py-1">
                OTP 认证
              </Badge>
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-normal text-foreground dark:text-foreground-dark">登录到个人中心</h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground dark:text-muted-dark-foreground">
                访问课程、证书、学习记录和项目进度。
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor={contactId} className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                  手机号或邮箱
                </label>
                <Input
                  id={contactId}
                  value={contact}
                  onChange={(event) => setContact(event.currentTarget.value)}
                  placeholder="请输入手机号或邮箱"
                  prefixIcon={<BookOpenCheck className="size-4" />}
                  rootClassName="h-12 rounded-xl bg-background shadow-none dark:bg-background-dark"
                />
                <p className="text-xs text-muted-foreground dark:text-muted-dark-foreground">
                  一次性验证码会发送到你的账号绑定联系方式。
                </p>
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold text-foreground dark:text-foreground-dark">输入验证码</legend>
                <div className="flex flex-wrap gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      aria-label={`验证码第 ${index + 1} 位`}
                      data-testid="standard-login-otp-input"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) => handleOtpChange(index, event.currentTarget.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      className="size-10 rounded-xl border border-border bg-background text-center text-sm font-bold text-foreground outline-none transition-colors focus:border-warning focus:ring-2 focus:ring-warning/30 dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark dark:focus:border-warning-dark dark:focus:ring-warning-dark/30"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground dark:text-muted-dark-foreground">
                  <span>没有收到验证码？重新发送</span>
                  <span>02:00</span>
                </div>
              </fieldset>

              <Button
                type="submit"
                fullWidth
                className="h-12 rounded-xl bg-warning text-warning-foreground hover:bg-warning-hover active:bg-warning-active dark:bg-warning-dark dark:text-warning-dark-foreground dark:hover:bg-warning-dark-hover dark:active:bg-warning-dark-active"
              >
                登录
              </Button>
            </form>

            <div className="mt-8 rounded-2xl border border-warning/30 bg-warning-soft/40 p-4 dark:border-warning-dark/30 dark:bg-warning-dark-soft/30">
              <div className="flex gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning dark:bg-warning-dark-soft dark:text-warning-dark">
                  <LockKeyhole className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-foreground dark:text-foreground-dark">安全免密登录</h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground dark:text-muted-dark-foreground">
                    无需记忆密码，系统将通过一次性验证码完成身份校验。
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-success dark:text-success-dark">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="size-3.5" aria-hidden="true" />
                      加密传输
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="size-3.5" aria-hidden="true" />
                      会话保护
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <KeyRound className="size-3.5" aria-hidden="true" />
                      无需密码
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <OtpLoginVisualPanel />
        </div>
      </div>
    </div>
  );
}

const getRootProps = (
  props: Omit<StandardLoginPagesProps, 'type' | 'onSubmit' | 'mock'>,
  type: StandardLoginPageType,
) => ({
  ...props,
  'data-testid': 'standard-login-pages-root',
  'data-template': type,
});

export function StandardLoginPages({
  className,
  mock = false,
  onSubmit,
  type = 'tech',
  ...props
}: StandardLoginPagesProps) {
  const rootProps = getRootProps(props, type);

  if (type === 'otp') {
    return <OtpLoginPage className={className} mock={mock} onSubmit={onSubmit} rootProps={rootProps} />;
  }

  const copy = templateCopy[type];
  const form = (
    <LoginFormPanel
      tone={type}
      title={copy.title}
      description={copy.description}
      buttonText={copy.buttonText}
      mock={mock}
      showRole={type === 'education'}
      showCaptcha={type === 'classic'}
      onSubmit={onSubmit}
    />
  );

  if (type === 'tech') {
    return (
      <div
        {...rootProps}
        className={cn(
          'relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-900 to-slate-950 p-6 text-white',
          className,
        )}
      >
        <div className="absolute inset-x-6 top-8 h-48 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-white/5" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
          {form}
        </div>
      </div>
    );
  }

  if (type === 'education') {
    return (
      <div
        {...rootProps}
        className={cn(
          'min-h-screen bg-gradient-to-br from-warning-soft via-background to-primary-soft p-6 dark:from-background-dark dark:via-surface-dark dark:to-primary-dark-soft',
          className,
        )}
      >
        <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-center">
          <section className="relative overflow-hidden rounded-3xl border border-warning/20 bg-surface/80 p-3 shadow-button backdrop-blur dark:border-border-dark dark:bg-surface-dark/80">
            <div className="absolute -left-12 top-10 size-36 rounded-full bg-warning-soft blur-2xl dark:bg-warning-dark-soft" aria-hidden="true" />
            <div className="absolute bottom-8 right-8 size-28 rounded-full border border-primary/20 dark:border-primary-dark/30" aria-hidden="true" />
            <Carousel slides={educationSlides} autoplay interval={5200} className="relative rounded-3xl" />
          </section>
          <div className="flex justify-center lg:justify-end">{form}</div>
        </div>
      </div>
    );
  }

  if (type === 'minimal') {
    return (
      <div
        {...rootProps}
        className={cn('min-h-screen bg-background px-6 py-10 dark:bg-black', className)}
      >
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm items-center justify-center">
          {form}
        </div>
      </div>
    );
  }

  if (type === 'split-screen') {
    return (
      <div
        {...rootProps}
        className={cn('grid min-h-screen bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark lg:grid-cols-2', className)}
      >
        <section className="relative flex min-h-[50vh] flex-col justify-between overflow-hidden bg-primary p-8 text-primary-foreground dark:bg-primary-dark-soft dark:text-foreground-dark lg:min-h-screen">
          <BrandBackground
            data-testid="standard-login-brand-background"
            className="bg-primary text-white/20 before:bg-white/20 after:bg-success-dark/20 dark:bg-primary-dark-soft dark:text-primary-dark/25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/75 to-primary-hover/80 dark:from-background-dark/80 dark:via-primary-dark-soft/75 dark:to-background-dark/90" aria-hidden="true" />
          <div className="relative flex items-center gap-3">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/15 shadow-sm backdrop-blur">
              <BrandLogo variant="icon" size="sm" className="size-8" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-white/75 dark:text-foreground-dark/75">ETLCHINA Enterprise</p>
              <h1 className="text-2xl font-bold tracking-normal text-white dark:text-foreground-dark">大型集团学习运营主系统</h1>
            </div>
          </div>

          <div className="relative max-w-xl space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white/80 dark:text-foreground-dark/80">集团级培训资产管理</p>
              <h2 className="text-4xl font-black leading-tight tracking-normal text-white dark:text-foreground-dark">
                把项目、学员、证书和学分放进同一个运营视图。
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Statistic
                title="已服务学员"
                value="10w+"
                trend="up"
                trendText="覆盖 28 个区域"
                className="border-white/20 bg-white/10 text-white shadow-none backdrop-blur [&_*]:text-white dark:border-white/20 dark:bg-white/10"
              />
              <Statistic
                title="开出证书"
                value="50k+"
                trend="up"
                trendText="电子签发闭环"
                className="border-white/20 bg-white/10 text-white shadow-none backdrop-blur [&_*]:text-white dark:border-white/20 dark:bg-white/10"
              />
            </div>
          </div>

          <p className="relative text-xs font-medium tracking-[0.08em] text-white/70 dark:text-foreground-dark/60">
            © 2026 HIGASHIKAWA CO., LTD. All Rights Reserved.
          </p>
        </section>

        <section className="relative flex min-h-[50vh] items-center justify-center p-6 lg:min-h-screen">
          <ThemeToggle className="absolute right-6 top-6" />
          {form}
        </section>
      </div>
    );
  }

  return (
    <div
      {...rootProps}
      className={cn('flex min-h-screen flex-col bg-secondary text-foreground dark:bg-background-dark dark:text-foreground-dark', className)}
    >
      <header className="border-b border-border bg-surface/90 px-6 py-5 shadow-sm dark:border-border-dark dark:bg-surface-dark/90">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-border bg-secondary text-primary dark:border-border-dark dark:bg-secondary-dark dark:text-primary-dark [&>svg]:size-6">
            <BookOpenCheck />
          </span>
          <div>
            <p className="text-sm font-medium text-muted-foreground dark:text-muted-dark-foreground">ETLCHINA Continuing Education</p>
            <h1 className="text-2xl font-bold tracking-normal text-foreground dark:text-foreground-dark">继续教育学分管理系统</h1>
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        {form}
      </main>
      <footer className="border-t border-border bg-surface/80 px-6 py-4 text-center text-sm text-muted-foreground dark:border-border-dark dark:bg-surface-dark/80 dark:text-muted-dark-foreground">
        © 2026 博奥智能培训平台 版权所有
      </footer>
    </div>
  );
}
