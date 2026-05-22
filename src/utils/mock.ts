export interface MockUser {
  id: string;
  /** 人员编号，统一使用 NX-2026-XXXX 格式，便于演示业务系统编码。 */
  code: string;
  name: string;
  /** 岗位名称，当前公司业务 mock 默认是从业人员。 */
  jobTitle: string;
  /** position 是 jobTitle 的兼容别名，便于不同后台字段快速接入。 */
  position: string;
  /** 身份证号只提供脱敏值，避免在 mock 数据里传播完整敏感信息。 */
  idCardMasked: string;
  /** phone 保持旧字段名，但值统一改为脱敏手机号。 */
  phone: string;
  phoneMasked: string;
  workUnit: string;
  workplace: string;
  address: string;
  /** 人脸识别头像使用本地 data URL，Storybook 离线也可直接预览。 */
  avatarUrl: string;
  projectName: string;
  trainingType: MockTrainingType;
  /** departmentOrClass 保留为项目名称别名，兼容上一轮故事和外部使用。 */
  departmentOrClass: string;
  progress: string;
  lastLoginAt: string;
}

export type MockTrainingType = '职业培训' | '继续教育' | '专项能力提升';
export type MockProjectStatus = '进行中' | '待开班' | '已结项';
export type MockCourseStatus = MockProjectStatus;

export interface MockProject {
  id: string;
  projectName: string;
  /** courseName 保留为 projectName 的兼容别名。 */
  courseName: string;
  trainingType: MockTrainingType;
  jobTitle: string;
  enrolledCount: number;
  /** learnerCount 保留为 enrolledCount 的兼容别名。 */
  learnerCount: number;
  organizer: string;
  projectManager: string;
  /** teacher 保留为 projectManager 的兼容别名。 */
  teacher: string;
  startDate: string;
  status: MockProjectStatus;
}

export interface MockCourse extends MockProject {}

export type MockSelectOptionType = 'department' | 'project' | 'trainingType' | 'status';

export type MockCertificateType = 'hours' | 'qualified' | 'education';
export type MockLearningTimelineType = 'joined' | 'course' | 'exam' | 'certificate';
export type MockLearningCourseStatus = '已完成' | '进行中' | '待开始';
export type MockLearningExamResult = '优秀' | '合格' | '学习中' | '待考核';

export interface MockCertificateData {
  studentName: string;
  idCardMasked: string;
  projectName: string;
  courseName?: string;
  hours?: number;
  credits?: number;
  certificateNo: string;
  issuedAt: string;
  organization?: string;
}

export interface MockLearningProfileStudent {
  id: string;
  name: string;
  idCardMasked: string;
  jobTitle: string;
  workUnit: string;
  joinedAt: string;
}

export interface MockLearningProfileSummary {
  totalHours: number;
  certificateCount: number;
  activeCourseCount: number;
  annualCredits: number;
}

export interface MockLearningProfileTimelineEvent {
  id: string;
  date: string;
  type: MockLearningTimelineType;
  title: string;
  description: string;
  certificateType?: MockCertificateType;
  certificateData?: MockCertificateData;
}

export interface MockLearningProfileCourse {
  id: string;
  courseName: string;
  hours: number;
  credits: number;
  examResult: MockLearningExamResult;
  status: MockLearningCourseStatus;
  completedAt: string;
}

export interface MockLearningProfileData {
  student: MockLearningProfileStudent;
  summary: MockLearningProfileSummary;
  timeline: MockLearningProfileTimelineEvent[];
  courses: MockLearningProfileCourse[];
}

export interface MockSelectOption {
  label: string;
  value: string;
}

const userNames = ['林予安', '周明轩', '陈晓雨', '赵一诺', '王嘉宁', '许若辰', '李思远', '韩沐阳'];
const projectNames = [
  '住建项目',
  '食品安全管理员项目',
  '继续医学教育项目',
  '睡眠技师项目',
  '睡眠健康管理师项目',
  '公共营养师项目',
  '应急救援员项目',
];
const trainingTypes: MockTrainingType[] = ['职业培训', '继续教育', '专项能力提升'];
const workUnits = [
  '南溪住建工程有限公司',
  '安心食品服务有限公司',
  '博鳌继续医学教育中心',
  '康眠健康管理有限公司',
  '南溪社区营养服务中心',
  '华安应急救援服务站',
  '新城物业服务有限公司',
  '仁和综合门诊部',
];
const addresses = [
  '北京市朝阳区建国路88号',
  '上海市浦东新区张江路128号',
  '广州市天河区体育西路66号',
  '深圳市南山区科技园一路19号',
  '成都市武侯区人民南路四段35号',
  '杭州市滨江区江南大道388号',
  '南京市鼓楼区中山北路101号',
  '武汉市洪山区珞喻路89号',
];
const progressValues = ['85%', '72%', '96%', '43%', '68%', '91%', '57%', '100%'];
const lastLoginTimes = [
  '2026-05-22 09:18',
  '2026-05-21 20:46',
  '2026-05-20 14:35',
  '2026-05-19 18:12',
  '2026-05-18 10:27',
  '2026-05-17 21:05',
  '2026-05-16 08:49',
  '2026-05-15 16:30',
];

const projectManagers = ['周亦辰', '林若楠', '陈致远', '王舒雅', '赵景行', '许安澜'];
const projectStatuses: MockProjectStatus[] = ['进行中', '待开班', '已结项'];
const startDates = ['2026-03-01', '2026-04-10', '2026-05-15', '2026-06-01', '2026-07-08', '2026-08-20'];

const selectOptionMap: Record<MockSelectOptionType, MockSelectOption[]> = {
  department: [
    { label: '住建项目', value: 'construction' },
    { label: '食品安全管理员项目', value: 'food-safety-manager' },
    { label: '继续医学教育项目', value: 'continuing-medical-education' },
    { label: '睡眠技师项目', value: 'sleep-technician' },
    { label: '睡眠健康管理师项目', value: 'sleep-health-manager' },
    { label: '公共营养师项目', value: 'public-nutritionist' },
    { label: '应急救援员项目', value: 'emergency-rescuer' },
  ],
  project: [
    { label: '住建项目', value: 'construction' },
    { label: '食品安全管理员项目', value: 'food-safety-manager' },
    { label: '继续医学教育项目', value: 'continuing-medical-education' },
    { label: '睡眠技师项目', value: 'sleep-technician' },
    { label: '睡眠健康管理师项目', value: 'sleep-health-manager' },
    { label: '公共营养师项目', value: 'public-nutritionist' },
    { label: '应急救援员项目', value: 'emergency-rescuer' },
  ],
  trainingType: [
    { label: '职业培训', value: 'vocational-training' },
    { label: '继续教育', value: 'continuing-education' },
    { label: '专项能力提升', value: 'special-capability' },
  ],
  status: [
    { label: '进行中', value: 'ongoing' },
    { label: '待开班', value: 'pending' },
    { label: '已结项', value: 'closed' },
  ],
};

const normalizeCount = (count: number) => Math.max(0, Math.floor(count));

const createAvatarDataUrl = (name: string, index: number) => {
  const hue = 205 + (index % 6) * 18;
  const initial = name.slice(-1);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="hsl(${hue} 88% 43%)"/><circle cx="48" cy="38" r="16" fill="hsl(0 0% 100% / 0.9)"/><path d="M22 82c4-18 16-28 26-28s22 10 26 28" fill="hsl(0 0% 100% / 0.86)"/><text x="48" y="53" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" font-weight="700" fill="hsl(${hue} 88% 32%)">${initial}</text></svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const mockUsers = (count: number): MockUser[] =>
  Array.from({ length: normalizeCount(count) }, (_, index) => {
    const code = `NX-2026-${String(index + 1).padStart(4, '0')}`;
    const name = userNames[index % userNames.length];
    const projectName = projectNames[index % projectNames.length];
    const trainingType = trainingTypes[index % trainingTypes.length];
    const phoneMasked = `138****${String(2026 + index).padStart(4, '0')}`;

    return {
      id: code,
      code,
      name,
      jobTitle: '从业人员',
      position: '从业人员',
      idCardMasked: `110101********${String(2026 + index).padStart(4, '0')}`,
      phone: phoneMasked,
      phoneMasked,
      workUnit: workUnits[index % workUnits.length],
      workplace: workUnits[index % workUnits.length],
      address: addresses[index % addresses.length],
      avatarUrl: createAvatarDataUrl(name, index),
      projectName,
      trainingType,
      departmentOrClass: projectName,
      progress: progressValues[index % progressValues.length],
      lastLoginAt: lastLoginTimes[index % lastLoginTimes.length],
    };
  });

export const mockProjects = (count: number): MockProject[] =>
  Array.from({ length: normalizeCount(count) }, (_, index) => ({
    id: `PROJECT-${String(index + 1).padStart(4, '0')}`,
    projectName: projectNames[index % projectNames.length],
    courseName: projectNames[index % projectNames.length],
    trainingType: trainingTypes[index % trainingTypes.length],
    jobTitle: '从业人员',
    enrolledCount: 286 + index * 43,
    learnerCount: 286 + index * 43,
    organizer: workUnits[index % workUnits.length],
    projectManager: projectManagers[index % projectManagers.length],
    teacher: projectManagers[index % projectManagers.length],
    startDate: startDates[index % startDates.length],
    status: projectStatuses[index % projectStatuses.length],
  }));

export const mockCourses = (count: number): MockCourse[] => mockProjects(count);

export const mockSelectOptions = (type: MockSelectOptionType): MockSelectOption[] => [...selectOptionMap[type]];

export const mockCertificate = (type: MockCertificateType): MockCertificateData => {
  const user = mockUsers(3)[type === 'hours' ? 0 : type === 'qualified' ? 1 : 2];
  const project = mockProjects(3)[type === 'hours' ? 0 : type === 'qualified' ? 1 : 2];
  const certificateMeta: Record<MockCertificateType, Pick<MockCertificateData, 'hours' | 'credits' | 'certificateNo'>> = {
    hours: {
      hours: 48,
      certificateNo: 'NX-CERT-HOURS-2026-0001',
    },
    qualified: {
      hours: 64,
      certificateNo: 'NX-CERT-QUALIFIED-2026-0002',
    },
    education: {
      credits: 12,
      certificateNo: 'NX-CERT-EDU-2026-0003',
    },
  };

  return {
    studentName: user.name,
    idCardMasked: user.idCardMasked,
    projectName: project.projectName,
    courseName:
      type === 'education'
        ? '继续教育规范化能力提升课程'
        : type === 'qualified'
          ? `${project.projectName}培训合格班`
          : `${project.projectName}在线学时课程`,
    issuedAt: '2026-05-22',
    organization: '灵境实训',
    ...certificateMeta[type],
  };
};

export const mockLearningProfile = (studentId = 'student-it-001'): MockLearningProfileData => {
  const qualifiedCertificate: MockCertificateData = {
    ...mockCertificate('qualified'),
    studentName: '张三',
    idCardMasked: '110101********1234',
    projectName: '企业级前端全栈工程化训练营',
    courseName: 'Next.js全栈工程化',
    hours: 48,
    certificateNo: 'NX-IT-QUALIFIED-2026-0408',
    issuedAt: '2026-04-08',
  };
  const hoursCertificate: MockCertificateData = {
    ...mockCertificate('hours'),
    studentName: '张三',
    idCardMasked: '110101********1234',
    projectName: '云原生应用研发能力提升计划',
    courseName: 'Node.js服务端实战',
    hours: 64,
    certificateNo: 'NX-IT-HOURS-2026-0318',
    issuedAt: '2026-03-18',
  };

  return {
    student: {
      id: studentId,
      name: '张三',
      idCardMasked: '110101********1234',
      jobTitle: '前端工程师',
      workUnit: '灵境实训数字化研发中心',
      joinedAt: '2026-02-28',
    },
    summary: {
      totalHours: 156,
      certificateCount: 2,
      activeCourseCount: 1,
      annualCredits: 18,
    },
    timeline: [
      {
        id: 'timeline-joined',
        date: '2026-02-28',
        type: 'joined',
        title: '加入 IT 工程化培训计划',
        description: '完成入学评估，进入企业级前端全栈工程化训练营。',
      },
      {
        id: 'timeline-nextjs-course',
        date: '2026-03-22',
        type: 'course',
        title: '完成《Next.js全栈工程化》课程',
        description: '累计完成 48 学时，覆盖 App Router、服务端渲染、权限与部署流水线。',
      },
      {
        id: 'timeline-nextjs-exam',
        date: '2026-03-30',
        type: 'exam',
        title: '通过《Next.js全栈工程化》考核',
        description: '综合项目评分 92 分，考核结果为合格。',
      },
      {
        id: 'timeline-hours-certificate',
        date: '2026-03-18',
        type: 'certificate',
        title: '获得《学时证明》',
        description: '完成 Node.js 服务端实战模块，获得 64 学时证明。',
        certificateType: 'hours',
        certificateData: hoursCertificate,
      },
      {
        id: 'timeline-qualified-certificate',
        date: '2026-04-08',
        type: 'certificate',
        title: '获得《培训合格证明》',
        description: '完成全栈工程化训练营并通过综合验收，证书可用于企业内部能力备案。',
        certificateType: 'qualified',
        certificateData: qualifiedCertificate,
      },
    ],
    courses: [
      {
        id: 'course-nextjs-fullstack',
        courseName: 'Next.js全栈工程化',
        hours: 48,
        credits: 6,
        examResult: '合格',
        status: '已完成',
        completedAt: '2026-03-22',
      },
      {
        id: 'course-node-service',
        courseName: 'Node.js服务端实战',
        hours: 64,
        credits: 8,
        examResult: '优秀',
        status: '已完成',
        completedAt: '2026-03-18',
      },
      {
        id: 'course-react-quality',
        courseName: 'React组件库质量工程',
        hours: 32,
        credits: 4,
        examResult: '学习中',
        status: '进行中',
        completedAt: '进行中',
      },
      {
        id: 'course-security-baseline',
        courseName: '前端安全与权限基线',
        hours: 12,
        credits: 0,
        examResult: '待考核',
        status: '待开始',
        completedAt: '2026-05-28',
      },
    ],
  };
};
