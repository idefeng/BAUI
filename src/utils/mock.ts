import { getRegionPath, getRegionValuePath } from './regions';

export const BA_TRAINING_PROJECT_WHITELIST = [
  'NEXUS-2026-AI',
  'NEXUS-2026-FRONTEND',
  'HIGASHI-CORE-2026',
] as const;

export const BA_TRAINNING_TITLE_WHITELIST = [
  'AI-AGENT-ENGINEER',
  'FULLSTACK-DEVELOPER',
  'IT-PROJECT-MANAGER',
] as const;

export const BA_TRAINNING_TYPE_WHITELIST = [
  'INITIAL-TRAINING',
  'QUALIFICATION-CERT',
  'CONTINUING-EDUCATION',
] as const;

export type BaTrainingProject = (typeof BA_TRAINING_PROJECT_WHITELIST)[number];
export type BaTrainningTitle = (typeof BA_TRAINNING_TITLE_WHITELIST)[number];
export type BaTrainningType = (typeof BA_TRAINNING_TYPE_WHITELIST)[number];

export interface BaBusinessProps {
  /** 是否启用组件内置 Mock 造数逻辑；真实业务数据传入时应始终优先。 */
  mock?: boolean;
  /** 培训项目代号，只接受 BA_TRAINING_PROJECT_WHITELIST 内的官方值。 */
  ba_training_project?: BaTrainingProject | string;
  /** 培训岗位代号，只接受 BA_TRAINNING_TITLE_WHITELIST 内的官方值。 */
  ba_trainning_title?: BaTrainningTitle | string;
  /** 培训类型代号，只接受 BA_TRAINNING_TYPE_WHITELIST 内的官方值。 */
  ba_trainning_type?: BaTrainningType | string;
  /** 属地范围 Adcode；必须能命中 Region Base，否则视为未设置。 */
  ba_region_scope?: string;
}

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

export type MockTrainingType = '职业培训' | '继续教育' | '专项能力提升' | '初任培训' | '合格证培训';
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
  /** mock 引擎根据业务属性推导出的证书类型，组件可用它覆盖默认展示模板。 */
  certificateType?: MockCertificateType;
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

export interface MockTechnologyInterestOption {
  label: string;
  value: string;
}

export interface MockSliderValueParams {
  min?: number;
  max?: number;
  step?: number;
  seed?: number;
}

export interface MockTransferItem {
  key: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface MockCascaderOption {
  value: string;
  label: string;
  children?: MockCascaderOption[];
}

export interface MockTreeNode {
  key: string;
  title: string;
  children?: MockTreeNode[];
}

export type MockStatisticTrend = 'up' | 'down';
export type MockTagVariant = 'primary' | 'success' | 'warning' | 'error' | 'gray';
export type MockProgressStatus = 'normal' | 'success' | 'exception';

export interface MockStatisticData {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: MockStatisticTrend;
  trendText?: string;
}

export interface MockDashboardMetric {
  id: string;
  label: string;
  value: number | string;
  suffix?: string;
  trend: MockStatisticTrend;
  trendText: string;
}

export interface MockCardGridItem {
  id: string;
  title: string;
  description: string;
  status: MockProjectStatus;
  projectName: string;
  trainingType: MockTrainingType;
  learnerCount: number;
  updatedAt: string;
  owner: string;
  tags: string[];
}

export type MockLoginRole = 'admin' | 'student' | 'teacher' | 'academic-admin';

export interface MockLoginAccount {
  username: string;
  password: string;
  role?: MockLoginRole;
}

export interface MockTagData {
  label: string;
  variant: MockTagVariant;
}

export interface MockProgressData {
  label: string;
  value: number;
  status: MockProgressStatus;
}

export type MockCalendarEventStatus = 'primary' | 'success' | 'warning' | 'error';

export interface MockCalendarEvent {
  date: string;
  title: string;
  status: MockCalendarEventStatus;
}

export interface MockColorOption {
  label: string;
  value: string;
}

export interface MockMentionOption {
  label: string;
  value: string;
  description?: string;
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
const statisticMetrics: MockStatisticData[] = [
  { title: '本周新增学员', value: 1286, suffix: '人', trend: 'up', trendText: '同比 +12.6%' },
  { title: '课程完课率', value: 86.4, suffix: '%', trend: 'up', trendText: '较上周 +3.2%' },
  { title: '待处理异常任务', value: 18, suffix: '项', trend: 'down', trendText: '环比 -4.8%' },
  { title: '本月培训营收', value: 328600, prefix: '¥', suffix: '元', trend: 'up', trendText: '同比 +18.9%' },
];
const dashboardMetrics: MockDashboardMetric[] = [
  { id: 'active-learners', label: '活跃学员', value: 1286, suffix: '人', trend: 'up', trendText: '同比 +12.6%' },
  { id: 'completion-rate', label: '课程完课率', value: '86.4', suffix: '%', trend: 'up', trendText: '较上周 +3.2%' },
  { id: 'certificate-issued', label: '证书签发', value: '5.2w', suffix: '张', trend: 'up', trendText: '本月 +18.9%' },
  { id: 'risk-tasks', label: '异常预警', value: 18, suffix: '项', trend: 'down', trendText: '环比 -4.8%' },
];
const cardTagPool = ['线上班', '可报名', '证书服务', '教务跟进', '企业内训', '质量复核'];
const tagSamples: MockTagData[] = [
  { label: 'React 组件库', variant: 'primary' },
  { label: '已通过', variant: 'success' },
  { label: '待复核', variant: 'warning' },
  { label: '异常任务', variant: 'error' },
  { label: '内部草稿', variant: 'gray' },
];
const progressSamples: MockProgressData[] = [
  { label: '课程平均完成率', value: 76, status: 'normal' },
  { label: '证书签发进度', value: 92, status: 'success' },
  { label: '异常任务处理率', value: 42, status: 'exception' },
];
const calendarEvents: MockCalendarEvent[] = [
  { date: '2026-05-22', title: '线上直播', status: 'primary' },
  { date: '2026-05-24', title: '证书复核', status: 'success' },
  { date: '2026-05-28', title: '排课确认', status: 'warning' },
];
const watermarkContents = ['BOAO 内部预览', '仅供培训项目使用'];
const colorOptions: MockColorOption[] = [
  { label: '科技蓝', value: 'hsl(218 100% 43%)' },
  { label: '成功绿', value: 'hsl(167 66% 44%)' },
  { label: '警示橙', value: 'hsl(32 95% 44%)' },
  { label: '危险红', value: 'hsl(4 86% 58%)' },
];
const loginAccounts: Record<MockLoginRole, MockLoginAccount> = {
  admin: { username: 'boao.admin', password: 'Boao@2026', role: 'admin' },
  student: { username: 'student.demo', password: 'Boao@2026', role: 'student' },
  teacher: { username: 'teacher.demo', password: 'Boao@2026', role: 'teacher' },
  'academic-admin': { username: 'academic.admin', password: 'Boao@2026', role: 'academic-admin' },
};

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

const cascaderOrganizationOptions: MockCascaderOption[] = [
  {
    value: 'boao-hq',
    label: '灵境实训总公司',
    children: [
      {
        value: 'technology-center',
        label: '技术中心',
        children: [
          { value: 'frontend-platform', label: '前端平台组' },
          { value: 'ai-engineering', label: 'AI 工程组' },
          { value: 'data-infra', label: '数据基础设施组' },
        ],
      },
      {
        value: 'learning-product-center',
        label: '学习产品中心',
        children: [
          { value: 'course-design', label: '课程设计组' },
          { value: 'exam-operations', label: '考试运营组' },
          { value: 'certificate-service', label: '证书服务组' },
        ],
      },
      {
        value: 'growth-center',
        label: '市场增长中心',
        children: [
          { value: 'brand-growth', label: '品牌增长组' },
          { value: 'regional-sales', label: '区域拓展组' },
          { value: 'partner-success', label: '渠道合作组' },
        ],
      },
      {
        value: 'customer-success-center',
        label: '客户成功中心',
        children: [
          { value: 'implementation', label: '交付实施组' },
          { value: 'support-service', label: '客户支持组' },
          { value: 'quality-review', label: '质量稽核组' },
        ],
      },
    ],
  },
];

const globalOrganizationTree: MockTreeNode[] = [
  {
    key: 'global-hq',
    title: '灵境实训集团总部',
    children: [
      {
        key: 'global-apac',
        title: '亚太分公司',
        children: [
          {
            key: 'global-apac-rd',
            title: '研发部',
            children: [
              { key: 'global-apac-rd-frontend', title: '前端体验组' },
              { key: 'global-apac-rd-ai', title: 'AI Agent 平台组' },
              { key: 'global-apac-rd-data', title: '数据工程组' },
            ],
          },
          {
            key: 'global-apac-ops',
            title: '运营部',
            children: [
              { key: 'global-apac-ops-learning', title: '学习运营组' },
              { key: 'global-apac-ops-customer', title: '客户成功组' },
            ],
          },
          {
            key: 'global-apac-teaching',
            title: '教学部',
            children: [
              { key: 'global-apac-teaching-course', title: '课程研发组' },
              { key: 'global-apac-teaching-exam', title: '考试教务组' },
            ],
          },
        ],
      },
      {
        key: 'global-europe',
        title: '欧洲分公司',
        children: [
          {
            key: 'global-europe-rd',
            title: '研发部',
            children: [
              { key: 'global-europe-rd-platform', title: '平台工程组' },
              { key: 'global-europe-rd-security', title: '安全合规组' },
            ],
          },
          {
            key: 'global-europe-ops',
            title: '运营部',
            children: [
              { key: 'global-europe-ops-localization', title: '本地化运营组' },
              { key: 'global-europe-ops-partner', title: '伙伴赋能组' },
            ],
          },
          {
            key: 'global-europe-teaching',
            title: '教学部',
            children: [
              { key: 'global-europe-teaching-live', title: '直播教研组' },
              { key: 'global-europe-teaching-quality', title: '质量督导组' },
            ],
          },
        ],
      },
      {
        key: 'global-americas',
        title: '美洲分公司',
        children: [
          {
            key: 'global-americas-rd',
            title: '研发部',
            children: [
              { key: 'global-americas-rd-cloud', title: '云原生工程组' },
              { key: 'global-americas-rd-mobile', title: '移动学习组' },
            ],
          },
          {
            key: 'global-americas-ops',
            title: '运营部',
            children: [
              { key: 'global-americas-ops-growth', title: '增长运营组' },
              { key: 'global-americas-ops-delivery', title: '项目交付组' },
            ],
          },
          {
            key: 'global-americas-teaching',
            title: '教学部',
            children: [
              { key: 'global-americas-teaching-enterprise', title: '企业内训组' },
              { key: 'global-americas-teaching-cert', title: '认证服务组' },
            ],
          },
        ],
      },
    ],
  },
];

const trainingScheduleTimeSlots = [
  { hour: 14, minute: 0 },
  { hour: 14, minute: 30 },
  { hour: 15, minute: 30 },
  { hour: 16, minute: 0 },
];

const technologyInterestOptions: MockTechnologyInterestOption[] = [
  { label: '前端', value: 'frontend' },
  { label: 'Java', value: 'java' },
  { label: 'AI Agent', value: 'ai-agent' },
  { label: 'Go', value: 'go' },
];

const transferCandidates: MockTransferItem[] = [
  { key: 'transfer-user-001', title: '林予安', description: '技术中心 / 前端平台组 / React 组件库' },
  { key: 'transfer-user-002', title: '周明轩', description: '技术中心 / Java 服务组 / 权限中台' },
  { key: 'transfer-user-003', title: '陈晓雨', description: 'AI 产品中心 / AI Agent 课程运营' },
  { key: 'transfer-user-004', title: '赵一诺', description: '数据基础设施组 / 数据治理' },
  { key: 'transfer-user-005', title: '王嘉宁', description: '学习产品中心 / 课程设计' },
  { key: 'transfer-user-006', title: '许若辰', description: '考试运营组 / 题库审核' },
  { key: 'transfer-user-007', title: '李思远', description: '客户成功中心 / 交付实施', disabled: true },
  { key: 'transfer-user-008', title: '韩沐阳', description: '市场增长中心 / 渠道合作' },
  { key: 'transfer-user-009', title: '沈知夏', description: '技术中心 / Go 服务组 / 高并发网关' },
  { key: 'transfer-user-010', title: '顾清越', description: '质量稽核组 / 学员档案复核' },
  { key: 'transfer-user-011', title: '陆景行', description: '安全合规组 / 内网权限审计' },
  { key: 'transfer-user-012', title: '苏念安', description: '证书服务组 / 证书签发' },
  { key: 'transfer-user-013', title: '程予白', description: '技术中心 / 前端平台组 / Storybook' },
  { key: 'transfer-user-014', title: '叶初晴', description: '产品运营组 / 培训项目排期' },
  { key: 'transfer-user-015', title: '唐星澜', description: '客户支持组 / 工单响应', disabled: true },
];

interface BusinessProjectPreset {
  projectName: string;
  organizer: string;
  courseSubjects: string[];
}

interface BusinessTitlePreset {
  jobTitle: string;
  courseSubjects: string[];
  technologyOptions: MockTechnologyInterestOption[];
  preferredTechnologyValues: string[];
}

interface BusinessTypePreset {
  trainingType: MockTrainingType;
  coursePrefix: string;
  certificateType: MockCertificateType;
  annualCredits: number;
  baseHours: number;
  learnerBase: number;
}

interface RegionalBusinessPreset {
  provinceName: string;
  branchName: string;
  addresses: string[];
  phonePrefixes: string[];
  coursePrefix: string;
}

interface BusinessContext {
  project?: BaTrainingProject;
  title?: BaTrainningTitle;
  type?: BaTrainningType;
  regionScope?: string;
  regionPath?: string[];
  regionProvinceName?: string;
  regionBranchName?: string;
  regionAddresses?: string[];
  regionPhonePrefixes?: string[];
  regionCoursePrefix?: string;
  projectName?: string;
  organizer?: string;
  jobTitle?: string;
  trainingType?: MockTrainingType;
  coursePrefix?: string;
  certificateType?: MockCertificateType;
  annualCredits?: number;
  baseHours?: number;
  learnerBase?: number;
  courseSubjects: string[];
  technologyOptions?: MockTechnologyInterestOption[];
  preferredTechnologyValues?: string[];
}

const businessProjectPresets: Record<BaTrainingProject, BusinessProjectPreset> = {
  'NEXUS-2026-AI': {
    projectName: 'NEXUS 2026 AI 实训项目',
    organizer: '灵境 AI 实训中心',
    courseSubjects: ['Python 智能体开发', '大模型 fine-tune 实战', 'AI Agent 生产部署'],
  },
  'NEXUS-2026-FRONTEND': {
    projectName: 'NEXUS 2026 前端工程项目',
    organizer: '灵境前端体验中心',
    courseSubjects: ['React 组件工程', 'TypeScript 业务建模', '前端质量工程'],
  },
  'HIGASHI-CORE-2026': {
    projectName: 'HIGASHI 2026 企业核心项目',
    organizer: 'HIGASHI 企业核心人才中心',
    courseSubjects: ['核心业务流程', '项目交付治理', '企业数字化协同'],
  },
};

const businessTitlePresets: Record<BaTrainningTitle, BusinessTitlePreset> = {
  'AI-AGENT-ENGINEER': {
    jobTitle: 'AI Agent 工程师',
    courseSubjects: ['Python 智能体开发', '大模型 fine-tune 实战', 'Agent 评测与安全'],
    technologyOptions: [
      { label: 'Python', value: 'python' },
      { label: '大模型 fine-tune', value: 'llm-fine-tune' },
      { label: 'Prompt Engineering', value: 'prompt-engineering' },
      { label: 'AI Agent', value: 'ai-agent' },
    ],
    preferredTechnologyValues: ['python', 'llm-fine-tune'],
  },
  'FULLSTACK-DEVELOPER': {
    jobTitle: '全栈开发工程师',
    courseSubjects: ['React 全栈交付', 'Node.js 服务端实战', '云原生部署流水线'],
    technologyOptions: [
      { label: 'React', value: 'react' },
      { label: 'Node.js', value: 'nodejs' },
      { label: 'TypeScript', value: 'typescript' },
      { label: '云原生', value: 'cloud-native' },
    ],
    preferredTechnologyValues: ['react', 'nodejs'],
  },
  'IT-PROJECT-MANAGER': {
    jobTitle: 'IT 项目经理',
    courseSubjects: ['项目范围管理', '敏捷交付治理', '风险与质量复盘'],
    technologyOptions: [
      { label: '项目管理', value: 'project-management' },
      { label: '敏捷交付', value: 'agile-delivery' },
      { label: '风险治理', value: 'risk-governance' },
      { label: '质量复盘', value: 'quality-review' },
    ],
    preferredTechnologyValues: ['project-management', 'risk-governance'],
  },
};

const businessTypePresets: Record<BaTrainningType, BusinessTypePreset> = {
  'INITIAL-TRAINING': {
    trainingType: '初任培训',
    coursePrefix: '初任培训：',
    certificateType: 'hours',
    annualCredits: 8,
    baseHours: 40,
    learnerBase: 188,
  },
  'QUALIFICATION-CERT': {
    trainingType: '合格证培训',
    coursePrefix: '合格证培训：',
    certificateType: 'qualified',
    annualCredits: 16,
    baseHours: 64,
    learnerBase: 236,
  },
  'CONTINUING-EDUCATION': {
    trainingType: '继续教育',
    coursePrefix: '继续教育：',
    certificateType: 'education',
    annualCredits: 32,
    baseHours: 24,
    learnerBase: 168,
  },
};

const regionalBusinessPresets: Record<string, RegionalBusinessPreset> = {
  '110000': {
    provinceName: '北京市',
    branchName: '北京市华北培训分部',
    addresses: ['北京市朝阳区建国路88号', '北京市海淀区中关村南大街5号', '北京市丰台区丽泽路16号'],
    phonePrefixes: ['136', '138', '139'],
    coursePrefix: '北京市医学继续教育必修课',
  },
  '310000': {
    provinceName: '上海市',
    branchName: '上海市华东培训分部',
    addresses: ['上海市浦东新区张江路128号', '上海市徐汇区漕溪北路18号', '上海市闵行区申长路988号'],
    phonePrefixes: ['135', '136', '139'],
    coursePrefix: '上海市医学继续教育必修课',
  },
  '440000': {
    provinceName: '广东省',
    branchName: '广东省华南培训分部',
    addresses: ['广东省广州市天河区珠江新城华夏路10号', '广东省深圳市南山区粤海街道科技园一路19号', '广东省佛山市顺德区大良街道凤山东路6号'],
    phonePrefixes: ['135', '136', '138', '139'],
    coursePrefix: '广东省医学继续教育必修课',
  },
  '320000': {
    provinceName: '江苏省',
    branchName: '江苏省长三角培训分部',
    addresses: ['江苏省南京市鼓楼区中山北路101号', '江苏省苏州市姑苏区人民路318号', '江苏省南京市江宁区胜太路88号'],
    phonePrefixes: ['135', '138', '139'],
    coursePrefix: '江苏省医学继续教育必修课',
  },
  '330000': {
    provinceName: '浙江省',
    branchName: '浙江省数字教育培训分部',
    addresses: ['浙江省杭州市滨江区江南大道388号', '浙江省杭州市西湖区文三路90号', '浙江省宁波市鄞州区首南中路398号'],
    phonePrefixes: ['135', '136', '138'],
    coursePrefix: '浙江省医学继续教育必修课',
  },
  '510000': {
    provinceName: '四川省',
    branchName: '四川省西南培训分部',
    addresses: ['四川省成都市武侯区人民南路四段35号', '四川省成都市锦江区红星路三段1号', '四川省绵阳市涪城区临园路东段54号'],
    phonePrefixes: ['135', '136', '138'],
    coursePrefix: '四川省医学继续教育必修课',
  },
  '420000': {
    provinceName: '湖北省',
    branchName: '湖北省华中培训分部',
    addresses: ['湖北省武汉市洪山区珞喻路89号', '湖北省武汉市武昌区中南路99号', '湖北省宜昌市西陵区沿江大道68号'],
    phonePrefixes: ['135', '136', '139'],
    coursePrefix: '湖北省医学继续教育必修课',
  },
  '370000': {
    provinceName: '山东省',
    branchName: '山东省北方培训分部',
    addresses: ['山东省济南市历下区经十路9999号', '山东省青岛市崂山区香港东路195号', '山东省济南市历城区工业北路58号'],
    phonePrefixes: ['135', '138', '139'],
    coursePrefix: '山东省医学继续教育必修课',
  },
};

const normalizeCount = (count: number) => Math.max(0, Math.floor(count));

const isAllowedBusinessValue = <T extends readonly string[]>(value: unknown, whitelist: T): value is T[number] =>
  typeof value === 'string' && whitelist.includes(value as T[number]);

const createRegionalContext = (regionScope: unknown) => {
  if (typeof regionScope !== 'string') {
    return undefined;
  }

  const regionValuePath = getRegionValuePath(regionScope);
  const regionPath = getRegionPath(regionScope);

  if (regionValuePath.length === 0 || regionPath.length === 0) {
    return undefined;
  }

  const provinceAdcode = regionValuePath[0];
  const provinceName = regionPath[0];
  const preset = regionalBusinessPresets[provinceAdcode] ?? {
    provinceName,
    branchName: `${provinceName}区域培训分部`,
    addresses: [`${regionPath.join('')}示范培训服务中心`],
    phonePrefixes: ['135', '136', '138'],
    coursePrefix: `${provinceName}医学继续教育必修课`,
  };

  return {
    regionScope: provinceAdcode,
    regionPath,
    regionProvinceName: preset.provinceName,
    regionBranchName: preset.branchName,
    regionAddresses: preset.addresses,
    regionPhonePrefixes: preset.phonePrefixes,
    regionCoursePrefix: preset.coursePrefix,
  };
};

const createBusinessContext = (businessProps: BaBusinessProps = {}): BusinessContext => {
  const project = isAllowedBusinessValue(businessProps.ba_training_project, BA_TRAINING_PROJECT_WHITELIST)
    ? businessProps.ba_training_project
    : undefined;
  const title = isAllowedBusinessValue(businessProps.ba_trainning_title, BA_TRAINNING_TITLE_WHITELIST)
    ? businessProps.ba_trainning_title
    : undefined;
  const type = isAllowedBusinessValue(businessProps.ba_trainning_type, BA_TRAINNING_TYPE_WHITELIST)
    ? businessProps.ba_trainning_type
    : undefined;
  const projectPreset = project ? businessProjectPresets[project] : undefined;
  const titlePreset = title ? businessTitlePresets[title] : undefined;
  const typePreset = type ? businessTypePresets[type] : undefined;
  const regionalContext = createRegionalContext(businessProps.ba_region_scope);

  return {
    project,
    title,
    type,
    ...regionalContext,
    projectName: projectPreset?.projectName,
    organizer: projectPreset?.organizer,
    jobTitle: titlePreset?.jobTitle,
    trainingType: typePreset?.trainingType,
    coursePrefix: typePreset?.coursePrefix,
    certificateType: typePreset?.certificateType,
    annualCredits: typePreset?.annualCredits,
    baseHours: typePreset?.baseHours,
    learnerBase: typePreset?.learnerBase,
    courseSubjects: titlePreset?.courseSubjects ?? projectPreset?.courseSubjects ?? [],
    technologyOptions: titlePreset?.technologyOptions,
    preferredTechnologyValues: titlePreset?.preferredTechnologyValues,
  };
};

const hasBusinessContext = (context: BusinessContext) =>
  Boolean(context.project || context.title || context.type || context.regionScope);

const getBusinessProjectName = (context: BusinessContext, index: number) =>
  context.projectName ?? projectNames[index % projectNames.length];

const getBusinessTrainingType = (context: BusinessContext, index: number) =>
  context.trainingType ?? trainingTypes[index % trainingTypes.length];

const getBusinessJobTitle = (context: BusinessContext) => context.jobTitle ?? '从业人员';

const getBusinessCourseName = (projectName: string, context: BusinessContext, index: number) => {
  if (!hasBusinessContext(context)) {
    return projectName;
  }

  const subject = context.courseSubjects[index % Math.max(1, context.courseSubjects.length)] ?? projectName;
  const baseName = context.projectName ? subject : projectName;
  const coursePrefix = context.regionCoursePrefix ? `${context.regionCoursePrefix}：` : context.coursePrefix ?? '';

  return `${coursePrefix}${baseName}`;
};

const createAvatarDataUrl = (name: string, index: number) => {
  const hue = 205 + (index % 6) * 18;
  const initial = name.slice(-1);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="hsl(${hue} 88% 43%)"/><circle cx="48" cy="38" r="16" fill="hsl(0 0% 100% / 0.9)"/><path d="M22 82c4-18 16-28 26-28s22 10 26 28" fill="hsl(0 0% 100% / 0.86)"/><text x="48" y="53" text-anchor="middle" font-size="24" font-family="Arial, sans-serif" font-weight="700" fill="hsl(${hue} 88% 32%)">${initial}</text></svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const mockUsers = (count: number, businessProps: BaBusinessProps = {}): MockUser[] => {
  const businessContext = createBusinessContext(businessProps);

  return Array.from({ length: normalizeCount(count) }, (_, index) => {
    const code = `NX-2026-${String(index + 1).padStart(4, '0')}`;
    const name = userNames[index % userNames.length];
    const projectName = getBusinessProjectName(businessContext, index);
    const trainingType = getBusinessTrainingType(businessContext, index);
    const jobTitle = getBusinessJobTitle(businessContext);
    const phonePrefix = businessContext.regionPhonePrefixes?.[index % businessContext.regionPhonePrefixes.length] ?? '138';
    const phoneMasked = `${phonePrefix}****${String(2026 + index).padStart(4, '0')}`;
    const workUnit = businessContext.regionBranchName ?? workUnits[index % workUnits.length];
    const address = businessContext.regionAddresses?.[index % businessContext.regionAddresses.length] ?? addresses[index % addresses.length];

    return {
      id: code,
      code,
      name,
      jobTitle,
      position: jobTitle,
      idCardMasked: `110101********${String(2026 + index).padStart(4, '0')}`,
      phone: phoneMasked,
      phoneMasked,
      workUnit,
      workplace: workUnit,
      address,
      avatarUrl: createAvatarDataUrl(name, index),
      projectName,
      trainingType,
      departmentOrClass: projectName,
      progress: progressValues[index % progressValues.length],
      lastLoginAt: lastLoginTimes[index % lastLoginTimes.length],
    };
  });
};

export const mockProjects = (count: number, businessProps: BaBusinessProps = {}): MockProject[] => {
  const businessContext = createBusinessContext(businessProps);

  return Array.from({ length: normalizeCount(count) }, (_, index) => {
    const projectName = getBusinessProjectName(businessContext, index);
    const learnerCount = (businessContext.learnerBase ?? 286) + index * 43;

    return {
      id: `PROJECT-${String(index + 1).padStart(4, '0')}`,
      projectName,
      courseName: getBusinessCourseName(projectName, businessContext, index),
      trainingType: getBusinessTrainingType(businessContext, index),
      jobTitle: getBusinessJobTitle(businessContext),
      enrolledCount: learnerCount,
      learnerCount,
      organizer: businessContext.regionBranchName ?? businessContext.organizer ?? workUnits[index % workUnits.length],
      projectManager: projectManagers[index % projectManagers.length],
      teacher: projectManagers[index % projectManagers.length],
      startDate: startDates[index % startDates.length],
      status: projectStatuses[index % projectStatuses.length],
    };
  });
};

export const mockCourses = (count: number, businessProps: BaBusinessProps = {}): MockCourse[] =>
  mockProjects(count, businessProps);

export const mockSelectOptions = (
  type: MockSelectOptionType,
  businessProps: BaBusinessProps = {},
): MockSelectOption[] => {
  const businessContext = createBusinessContext(businessProps);
  const options = [...selectOptionMap[type]];

  if ((type === 'project' || type === 'department') && businessContext.project && businessContext.projectName) {
    return [
      { label: businessContext.projectName, value: businessContext.project },
      ...options.filter((option) => option.value !== businessContext.project),
    ];
  }

  if (type === 'trainingType' && businessContext.type && businessContext.trainingType) {
    return [
      { label: businessContext.trainingType, value: businessContext.type },
      ...options.filter((option) => option.value !== businessContext.type),
    ];
  }

  return options;
};

export const mockAutoCompleteOptions = (type: MockSelectOptionType = 'project'): MockSelectOption[] =>
  mockSelectOptions(type);

export const mockRateValue = (seed = Date.now()) => (Math.abs(Math.floor(seed)) % 2) + 4;

export const mockCalendarEvents = (): MockCalendarEvent[] =>
  calendarEvents.map((event) => ({ ...event }));

export const mockWatermarkContent = (): string[] => [...watermarkContents];

export const mockColorOptions = (): MockColorOption[] =>
  colorOptions.map((option) => ({ ...option }));

export const mockMentionOptions = (count = 6, businessProps: BaBusinessProps = {}): MockMentionOption[] =>
  mockUsers(count, businessProps).map((user) => ({
    label: user.name,
    value: user.id,
    description: `${user.projectName} / ${user.workUnit}`,
  }));

export const mockCascaderOptions = (): MockCascaderOption[] =>
  cascaderOrganizationOptions.map((option) => ({
    ...option,
    children: option.children?.map((child) => ({
      ...child,
      children: child.children ? [...child.children] : undefined,
    })),
  }));

const cloneTreeNodes = (nodes: MockTreeNode[]): MockTreeNode[] =>
  nodes.map((node) => ({
    ...node,
    children: node.children ? cloneTreeNodes(node.children) : undefined,
  }));

const collectLeafTreeKeys = (nodes: MockTreeNode[]): string[] =>
  nodes.flatMap((node) => (node.children?.length ? collectLeafTreeKeys(node.children) : [node.key]));

export const mockTreeData = (): MockTreeNode[] => cloneTreeNodes(globalOrganizationTree);

export const mockTreeSelectValue = (treeData = mockTreeData(), seed = Date.now()): string[] => {
  const leafKeys = collectLeafTreeKeys(treeData);

  if (leafKeys.length === 0) {
    return [];
  }

  const safeSeed = Math.abs(Math.floor(seed));
  const count = Math.min(leafKeys.length, (safeSeed % 3) + 2);
  const startIndex = safeSeed % leafKeys.length;

  // 只随机叶子节点，交给 TreeSelect 的父子联动逻辑回推父节点半选/全选状态。
  return Array.from({ length: count }, (_, index) => leafKeys[(startIndex + index) % leafKeys.length]);
};

export const mockTrainingScheduleDateTime = (baseDate = new Date()): Date => {
  const dayOffset = (baseDate.getDate() % 2) + 1;
  const slot = trainingScheduleTimeSlots[(baseDate.getDate() + 3) % trainingScheduleTimeSlots.length];
  const scheduleTime = new Date(baseDate);

  scheduleTime.setDate(baseDate.getDate() + dayOffset);
  scheduleTime.setHours(slot.hour, slot.minute, 0, 0);

  return scheduleTime;
};

export const mockTechnologyInterestOptions = (businessProps: BaBusinessProps = {}): MockTechnologyInterestOption[] => {
  const businessContext = createBusinessContext(businessProps);

  return (businessContext.technologyOptions ?? technologyInterestOptions).map((option) => ({ ...option }));
};

export const mockPickTechnologyInterests = (
  options = mockTechnologyInterestOptions(),
  seed = Date.now(),
  businessProps: BaBusinessProps = {},
): string[] => {
  if (options.length === 0) {
    return [];
  }

  const businessContext = createBusinessContext(businessProps);
  const preferredValues = businessContext.preferredTechnologyValues?.filter((value) =>
    options.some((option) => option.value === value),
  );

  if (preferredValues?.length) {
    return preferredValues;
  }

  const count = Math.min(options.length, (Math.abs(Math.floor(seed)) % 2) + 1);
  const startIndex = Math.abs(Math.floor(seed)) % options.length;

  return Array.from({ length: count }, (_, index) => options[(startIndex + index) % options.length].value);
};

export const mockSwitchChecked = (seed = Date.now()) => Math.abs(Math.floor(seed)) % 2 === 0;

export const mockSliderValue = ({
  max = 100,
  min = 0,
  seed = Date.now(),
  step = 1,
}: MockSliderValueParams = {}) => {
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  const safeStep = step > 0 ? step : 1;
  const stepSlots = Math.max(1, Math.floor((upper - lower) / safeStep));
  // 用 seed 生成稳定候选值，并严格贴合 step，避免 Form 一键填表出现半格数值。
  const offset = Math.abs(Math.floor(seed)) % stepSlots;

  return Math.min(upper, lower + offset * safeStep);
};

export const mockStatistic = (seed = 0): MockStatisticData => ({
  ...statisticMetrics[Math.abs(Math.floor(seed)) % statisticMetrics.length],
});

export const mockDashboardMetrics = (businessProps: BaBusinessProps = {}): MockDashboardMetric[] => {
  const businessContext = createBusinessContext(businessProps);

  if (businessContext.regionProvinceName) {
    const provinceName = businessContext.regionProvinceName;

    if (businessContext.type === 'CONTINUING-EDUCATION') {
      return [
        {
          id: 'region-annual-continuing-credits',
          label: `${provinceName}年度继续教育学分`,
          value: businessContext.annualCredits ?? 32,
          suffix: '学分',
          trend: 'up',
          trendText: `${provinceName}学分达标率提升`,
        },
        { id: 'region-credit-completion-rate', label: `${provinceName}学分达标率`, value: '94.6', suffix: '%', trend: 'up', trendText: `${provinceName}较上周 +5.1%` },
        { id: 'region-education-certificates', label: `${provinceName}证书签发`, value: '1.2w', suffix: '张', trend: 'up', trendText: `${provinceName}本月 +14.8%` },
        { id: 'region-credit-risk-learners', label: `${provinceName}待补学分`, value: 18, suffix: '人', trend: 'down', trendText: `${provinceName}环比 -6.4%` },
      ];
    }

    return [
      { id: 'region-active-learners', label: `${provinceName}活跃学员`, value: 986, suffix: '人', trend: 'up', trendText: `${provinceName}本周 +9.8%` },
      { id: 'region-branch-projects', label: `${provinceName}分部项目`, value: 28, suffix: '项', trend: 'up', trendText: `${provinceName}覆盖核心城市` },
      { id: 'region-certificates-issued', label: `${provinceName}证书签发`, value: '1.2w', suffix: '张', trend: 'up', trendText: `${provinceName}本月 +13.2%` },
      { id: 'region-risk-tasks', label: `${provinceName}待处理异常`, value: 9, suffix: '项', trend: 'down', trendText: `${provinceName}环比 -5.1%` },
    ];
  }

  if (businessContext.type === 'CONTINUING-EDUCATION') {
    return [
      {
        id: 'annual-continuing-credits',
        label: '年度继续教育学分',
        value: businessContext.annualCredits ?? 32,
        suffix: '学分',
        trend: 'up',
        trendText: businessContext.projectName ?? '继续教育项目',
      },
      { id: 'credit-completion-rate', label: '学分达标率', value: '92.8', suffix: '%', trend: 'up', trendText: '较上周 +4.6%' },
      { id: 'education-certificates', label: '学分证书签发', value: '1.8w', suffix: '张', trend: 'up', trendText: '本月 +16.4%' },
      { id: 'credit-risk-learners', label: '待补学分学员', value: 36, suffix: '人', trend: 'down', trendText: '环比 -7.2%' },
    ];
  }

  return dashboardMetrics.map((metric) => ({ ...metric }));
};

export const mockCardGridItems = (count = 12, businessProps: BaBusinessProps = {}): MockCardGridItem[] =>
  mockProjects(count, businessProps).map((project, index) => ({
    id: `card-project-${String(index + 1).padStart(4, '0')}`,
    title: project.courseName,
    description: `${project.organizer} 发起的${project.trainingType}项目，面向${project.jobTitle}提供报名、学习、考核与证书跟踪。`,
    status: project.status,
    projectName: project.projectName,
    trainingType: project.trainingType,
    learnerCount: project.learnerCount,
    updatedAt: project.startDate,
    owner: project.projectManager,
    // 取连续标签，保证每张卡片既稳定又有轻微差异。
    tags: [cardTagPool[index % cardTagPool.length], cardTagPool[(index + 2) % cardTagPool.length]],
  }));

export const mockLoginAccount = (role: MockLoginRole = 'admin'): MockLoginAccount => ({
  ...loginAccounts[role],
});

export const mockTags = (count = tagSamples.length, seed = 0): MockTagData[] => {
  const safeCount = Math.min(tagSamples.length, Math.max(0, Math.floor(count)));
  const startIndex = Math.abs(Math.floor(seed)) % tagSamples.length;

  return Array.from({ length: safeCount }, (_, index) => ({
    ...tagSamples[(startIndex + index) % tagSamples.length],
  }));
};

export const mockProgress = (seed = 0): MockProgressData => ({
  ...progressSamples[Math.abs(Math.floor(seed)) % progressSamples.length],
});

export const mockTransferData = (): MockTransferItem[] => transferCandidates.map((item) => ({ ...item }));

export const mockTransferTargetKeys = (
  dataSource = mockTransferData(),
  seed = Date.now(),
  count = 3,
): string[] => {
  const enabledItems = dataSource.filter((item) => !item.disabled);

  if (enabledItems.length === 0) {
    return [];
  }

  const startIndex = Math.abs(Math.floor(seed)) % enabledItems.length;
  const targetCount = Math.min(enabledItems.length, Math.max(0, Math.floor(count)));

  return Array.from({ length: targetCount }, (_, index) => enabledItems[(startIndex + index) % enabledItems.length].key);
};

export const mockCertificate = (
  type: MockCertificateType,
  businessProps: BaBusinessProps = {},
): MockCertificateData => {
  const businessContext = createBusinessContext(businessProps);
  const effectiveType = businessContext.certificateType ?? type;
  const dataIndex = effectiveType === 'hours' ? 0 : effectiveType === 'qualified' ? 1 : 2;
  const user = mockUsers(3, businessProps)[dataIndex];
  const project = mockProjects(3, businessProps)[dataIndex];
  const certificateMeta: Record<MockCertificateType, Pick<MockCertificateData, 'hours' | 'credits' | 'certificateNo'>> = {
    hours: {
      hours: businessContext.baseHours ?? 48,
      certificateNo: 'NX-CERT-HOURS-2026-0001',
    },
    qualified: {
      hours: businessContext.baseHours ?? 64,
      certificateNo: 'NX-CERT-QUALIFIED-2026-0002',
    },
    education: {
      credits: businessContext.annualCredits ?? 12,
      certificateNo: 'NX-CERT-EDU-2026-0003',
    },
  };

  return {
    certificateType: effectiveType,
    studentName: user.name,
    idCardMasked: user.idCardMasked,
    projectName: project.projectName,
    courseName:
      hasBusinessContext(businessContext)
        ? project.courseName
        : effectiveType === 'education'
          ? '继续教育规范化能力提升课程'
          : effectiveType === 'qualified'
          ? `${project.projectName}培训合格班`
          : `${project.projectName}在线学时课程`,
    issuedAt: '2026-05-22',
    organization: businessContext.regionBranchName ?? businessContext.organizer ?? '灵境实训',
    ...certificateMeta[effectiveType],
  };
};

export const mockLearningProfile = (
  studentId = 'student-it-001',
  businessProps: BaBusinessProps = {},
): MockLearningProfileData => {
  const businessContext = createBusinessContext(businessProps);

  if (hasBusinessContext(businessContext)) {
    const [user] = mockUsers(1, businessProps);
    const projects = mockProjects(4, businessProps);
    const educationCertificate = mockCertificate('education', businessProps);
    const hours = businessContext.baseHours ?? 24;
    const annualCredits = businessContext.annualCredits ?? 32;
    const courses: MockLearningProfileCourse[] = projects.map((project, index) => ({
      id: `course-business-${index + 1}`,
      courseName: project.courseName,
      hours: hours + index * 4,
      credits: Math.max(4, Math.floor(annualCredits / 4)),
      examResult: index === 2 ? '学习中' : index === 3 ? '待考核' : '优秀',
      status: index === 2 ? '进行中' : index === 3 ? '待开始' : '已完成',
      completedAt: index >= 2 ? '进行中' : startDates[index % startDates.length],
    }));

    return {
      student: {
        id: studentId,
        name: user.name,
        idCardMasked: user.idCardMasked,
        jobTitle: user.jobTitle,
        workUnit: user.workUnit,
        joinedAt: '2026-02-28',
      },
      summary: {
        totalHours: courses.reduce((sum, course) => sum + course.hours, 0),
        certificateCount: 1,
        activeCourseCount: courses.filter((course) => course.status === '进行中').length,
        annualCredits,
      },
      timeline: [
        {
          id: 'timeline-business-joined',
          date: '2026-02-28',
          type: 'joined',
          title: `加入${user.projectName}`,
          description: `完成${user.jobTitle}方向入学评估，进入${user.trainingType}学习计划。`,
        },
        {
          id: 'timeline-business-course',
          date: '2026-03-22',
          type: 'course',
          title: `完成《${courses[0].courseName}》课程`,
          description: `累计完成 ${courses[0].hours} 学时，按${user.trainingType}规则折算年度学分。`,
        },
        {
          id: 'timeline-business-credits',
          date: '2026-04-08',
          type: 'exam',
          title: '年度继续教育学分达标',
          description: `当前年度已累计 ${annualCredits} 学分，满足${user.projectName}继续教育要求。`,
        },
        {
          id: 'timeline-business-certificate',
          date: '2026-04-18',
          type: 'certificate',
          title: '获得《继续教育学分证书》',
          description: `完成${courses[0].courseName}及配套任务，获得继续教育学分证书。`,
          certificateType: 'education',
          certificateData: educationCertificate,
        },
      ],
      courses,
    };
  }

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
