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
