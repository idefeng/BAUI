import { describe, expect, it } from 'vitest';

import {
  BA_TRAINING_PROJECT_WHITELIST,
  BA_TRAINNING_TITLE_WHITELIST,
  BA_TRAINNING_TYPE_WHITELIST,
  mockCascaderOptions,
  mockCardGridItems,
  mockCertificate,
  mockCourses,
  mockDashboardMetrics,
  mockLearningProfile,
  mockLoginAccount,
  mockPickTechnologyInterests,
  mockProjects,
  mockSelectOptions,
  mockSliderValue,
  mockSwitchChecked,
  mockTechnologyInterestOptions,
  mockTreeData,
  mockTreeSelectValue,
  mockTransferData,
  mockTransferTargetKeys,
  mockTrainingScheduleDateTime,
  mockUsers,
} from './mock';

describe('mock data workshop', () => {
  it('暴露公司业务属性官方白名单，供组件和 Storybook 统一复用', () => {
    expect(BA_TRAINING_PROJECT_WHITELIST).toEqual([
      'NEXUS-2026-AI',
      'NEXUS-2026-FRONTEND',
      'HIGASHI-CORE-2026',
    ]);
    expect(BA_TRAINNING_TITLE_WHITELIST).toEqual([
      'AI-AGENT-ENGINEER',
      'FULLSTACK-DEVELOPER',
      'IT-PROJECT-MANAGER',
    ]);
    expect(BA_TRAINNING_TYPE_WHITELIST).toEqual([
      'INITIAL-TRAINING',
      'QUALIFICATION-CERT',
      'CONTINUING-EDUCATION',
    ]);
  });

  it('生成带脱敏信息的从业人员基本信息', () => {
    const users = mockUsers(3);

    expect(users).toHaveLength(3);
    expect(users[0]).toMatchObject({
      code: 'NX-2026-0001',
      name: '林予安',
      jobTitle: '从业人员',
      idCardMasked: '110101********2026',
      phone: '138****2026',
      phoneMasked: '138****2026',
      workUnit: '南溪住建工程有限公司',
      address: '北京市朝阳区建国路88号',
      projectName: '住建项目',
      trainingType: '职业培训',
    });
    expect(users[0].avatarUrl).toMatch(/^data:image\/svg\+xml;charset=UTF-8,/);
    expect(users[0].lastLoginAt).toMatch(/^2026-05-\d{2} \d{2}:\d{2}$/);
  });

  it('非法业务属性会被中央 mock 引擎擦除并回落到通用数据', () => {
    const baselineUser = mockUsers(1)[0];
    const baselineCourse = mockCourses(1)[0];
    const invalidUser = mockUsers(1, {
      ba_training_project: 'INVALID-PROJECT',
      ba_trainning_title: 'INVALID-TITLE',
      ba_trainning_type: 'INVALID-TYPE',
    })[0];
    const invalidCourse = mockCourses(1, {
      ba_training_project: 'INVALID-PROJECT',
      ba_trainning_title: 'INVALID-TITLE',
      ba_trainning_type: 'INVALID-TYPE',
    })[0];

    expect(invalidUser.projectName).toBe(baselineUser.projectName);
    expect(invalidUser.jobTitle).toBe(baselineUser.jobTitle);
    expect(invalidUser.trainingType).toBe(baselineUser.trainingType);
    expect(invalidCourse.projectName).toBe(baselineCourse.projectName);
    expect(invalidCourse.jobTitle).toBe(baselineCourse.jobTitle);
    expect(invalidCourse.trainingType).toBe(baselineCourse.trainingType);
  });

  it('合法业务属性会让人员、课程、证书和学习档案切换为继续教育 AI 岗位语义', () => {
    const businessProps = {
      ba_training_project: 'NEXUS-2026-AI',
      ba_trainning_title: 'AI-AGENT-ENGINEER',
      ba_trainning_type: 'CONTINUING-EDUCATION',
    };
    const users = mockUsers(2, businessProps);
    const courses = mockCourses(3, businessProps);
    const certificate = mockCertificate('hours', businessProps);
    const profile = mockLearningProfile('student-ai-001', businessProps);

    expect(users.every((user) => user.projectName === 'NEXUS 2026 AI 实训项目')).toBe(true);
    expect(users.every((user) => user.jobTitle === 'AI Agent 工程师')).toBe(true);
    expect(users.every((user) => user.trainingType === '继续教育')).toBe(true);
    expect(courses.every((course) => course.courseName.startsWith('继续教育：'))).toBe(true);
    expect(courses.every((course) => course.trainingType === '继续教育')).toBe(true);
    expect(certificate.courseName).toContain('继续教育：');
    expect(certificate.credits).toBeGreaterThanOrEqual(24);
    expect(certificate.certificateNo).toContain('EDU');
    expect(profile.student.jobTitle).toBe('AI Agent 工程师');
    expect(profile.summary.annualCredits).toBeGreaterThanOrEqual(24);
    expect(profile.courses.every((course) => course.courseName.startsWith('继续教育：'))).toBe(true);
    expect(profile.timeline.map((event) => event.title).join(' ')).toContain('继续教育');
  });

  it('ba_region_scope 会让学员、手机号段和课程前缀具备广东属地特征', () => {
    const users = mockUsers(3, {
      ba_region_scope: '440000',
      ba_trainning_type: 'CONTINUING-EDUCATION',
    });
    const courses = mockCourses(2, {
      ba_region_scope: '440000',
      ba_trainning_type: 'CONTINUING-EDUCATION',
    });

    expect(users.every((user) => user.address.includes('广东省'))).toBe(true);
    expect(users.every((user) => user.workUnit.includes('广东省'))).toBe(true);
    expect(users.every((user) => /^13[5689]\*\*\*\*\d{4}$/.test(user.phoneMasked))).toBe(true);
    expect(courses.every((course) => course.courseName.startsWith('广东省医学继续教育必修课'))).toBe(true);
    expect(courses.every((course) => course.organizer.includes('广东省'))).toBe(true);
  });

  it('Dashboard 指标能根据 ba_region_scope 切换为属地大屏数据', () => {
    const metrics = mockDashboardMetrics({
      ba_region_scope: '440000',
    });

    expect(metrics[0].label).toBe('广东省活跃学员');
    expect(metrics.map((metric) => metric.trendText).join(' ')).toContain('广东省');
  });

  it('AI Agent 工程师岗位会让技术方向一键填表偏向 Python 与大模型 fine-tune', () => {
    const options = mockTechnologyInterestOptions({
      ba_trainning_title: 'AI-AGENT-ENGINEER',
    });
    const selectedValues = mockPickTechnologyInterests(options, 1, {
      ba_trainning_title: 'AI-AGENT-ENGINEER',
    });

    expect(options).toEqual(
      expect.arrayContaining([
        { label: 'Python', value: 'python' },
        { label: '大模型 fine-tune', value: 'llm-fine-tune' },
      ]),
    );
    expect(selectedValues).toEqual(['python', 'llm-fine-tune']);
  });

  it('生成项目与培训类型数据，并保留 mockCourses 兼容出口', () => {
    const projects = mockProjects(2);
    const courses = mockCourses(1);

    expect(projects).toHaveLength(2);
    expect(projects[0]).toMatchObject({
      projectName: '住建项目',
      courseName: '住建项目',
      trainingType: '职业培训',
      jobTitle: '从业人员',
      learnerCount: 286,
      status: '进行中',
    });
    expect(courses[0].projectName).toBe('住建项目');
  });

  it('提供可直接用于下拉框的项目、培训类型和状态选项', () => {
    expect(mockSelectOptions('department')).toContainEqual({ label: '食品安全管理员项目', value: 'food-safety-manager' });
    expect(mockSelectOptions('trainingType')).toContainEqual({ label: '专项能力提升', value: 'special-capability' });
    expect(mockSelectOptions('status')).toContainEqual({ label: '进行中', value: 'ongoing' });
  });

  it('生成可直接用于 Cascader 的三层公司组织架构树', () => {
    const options = mockCascaderOptions();

    expect(options).toHaveLength(1);
    expect(options[0]).toMatchObject({ value: 'boao-hq', label: '灵境实训总公司' });
    expect(options[0].children).toHaveLength(4);
    expect(options[0].children?.map((option) => option.label)).toEqual(
      expect.arrayContaining(['技术中心', '学习产品中心', '市场增长中心', '客户成功中心']),
    );
    expect(options[0].children?.[0].children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: 'frontend-platform', label: '前端平台组' }),
        expect.objectContaining({ value: 'ai-engineering', label: 'AI 工程组' }),
      ]),
    );
  });

  it('生成符合培训排课场景的未来 mock 日期时间', () => {
    const scheduleTime = mockTrainingScheduleDateTime(new Date(2026, 4, 22, 9, 0, 0));

    expect(scheduleTime.getFullYear()).toBe(2026);
    expect(scheduleTime.getMonth()).toBe(4);
    expect(scheduleTime.getDate()).toBe(23);
    expect(scheduleTime.getHours()).toBe(14);
    expect(scheduleTime.getMinutes()).toBe(30);
    expect(scheduleTime.getSeconds()).toBe(0);
  });

  it('生成 CheckboxGroup 技术方向选项和一键填表选中值', () => {
    const options = mockTechnologyInterestOptions();
    const selectedValues = mockPickTechnologyInterests(options, 2);

    expect(options).toEqual([
      { label: '前端', value: 'frontend' },
      { label: 'Java', value: 'java' },
      { label: 'AI Agent', value: 'ai-agent' },
      { label: 'Go', value: 'go' },
    ]);
    expect(selectedValues).toEqual(['ai-agent']);
  });

  it('生成 switch 一键填表布尔值', () => {
    expect(mockSwitchChecked(2)).toBe(true);
    expect(mockSwitchChecked(3)).toBe(false);
  });

  it('按 min/max/step 生成 Slider 一键填表数值', () => {
    expect(mockSliderValue({ min: 8000, max: 20000, step: 1000, seed: 4 })).toBe(12000);
    expect(mockSliderValue({ min: 3, max: 9, step: 2, seed: 10 })).toBe(5);
  });

  it('生成 Transfer 候选人数据和一键填表目标 keys', () => {
    const transferData = mockTransferData();
    const targetKeys = mockTransferTargetKeys(transferData, 1, 3);

    expect(transferData).toHaveLength(15);
    expect(transferData[0]).toMatchObject({
      key: 'transfer-user-001',
      title: '林予安',
    });
    expect(transferData[0].description).toContain('技术中心');
    expect(targetKeys).toHaveLength(3);
    expect(targetKeys.every((key) => transferData.some((item) => item.key === key && !item.disabled))).toBe(true);
  });

  it('生成公司全球多级组织架构树和 TreeSelect 一键填表值', () => {
    const treeData = mockTreeData();
    const selectedKeys = mockTreeSelectValue(treeData, 2);

    expect(treeData[0]).toMatchObject({
      key: 'global-hq',
      title: '灵境实训集团总部',
    });
    expect(treeData[0].children).toHaveLength(3);
    expect(treeData[0].children?.[0].children?.map((node) => node.title)).toEqual(
      expect.arrayContaining(['研发部', '运营部', '教学部']),
    );
    expect(selectedKeys.length).toBeGreaterThanOrEqual(2);
    expect(selectedKeys.length).toBeLessThanOrEqual(4);
    expect(selectedKeys.every((key) => key.startsWith('global-'))).toBe(true);
  });

  it('按证书类型生成脱敏的公司证书 mock 数据', () => {
    const hours = mockCertificate('hours');
    const education = mockCertificate('education');

    expect(hours).toMatchObject({
      studentName: '林予安',
      idCardMasked: '110101********2026',
      projectName: '住建项目',
      hours: 48,
      certificateNo: 'NX-CERT-HOURS-2026-0001',
    });
    expect(education.credits).toBe(12);
    expect(education.certificateNo).toBe('NX-CERT-EDU-2026-0003');
    expect(hours.idCardMasked).toContain('********');
  });

  it('生成登录页 AI 一键填表使用的演示账号', () => {
    expect(mockLoginAccount()).toEqual({
      username: 'boao.admin',
      password: 'Boao@2026',
      role: 'admin',
    });
    expect(mockLoginAccount('student')).toMatchObject({
      username: 'student.demo',
      role: 'student',
    });
  });

  it('生成 DashboardTemplate 科技大屏使用的 4 个指标 mock 数据', () => {
    const metrics = mockDashboardMetrics();

    expect(metrics).toHaveLength(4);
    expect(metrics[0]).toMatchObject({
      id: 'active-learners',
      label: '活跃学员',
      value: 1286,
      suffix: '人',
    });
    expect(metrics.every((metric) => metric.trendText.length > 0)).toBe(true);
  });

  it('生成 CardGridPage 使用的项目卡片 mock 数据', () => {
    const cards = mockCardGridItems(12);

    expect(cards).toHaveLength(12);
    expect(cards[0]).toMatchObject({
      id: 'card-project-0001',
      title: '住建项目',
      projectName: '住建项目',
      trainingType: '职业培训',
      status: '进行中',
    });
    expect(cards[0].tags.length).toBeGreaterThan(0);
  });

  it('生成综合学习档案 mock 数据并包含 IT 培训成长轨迹', () => {
    const profile = mockLearningProfile('student-it-001');

    expect(profile.student).toMatchObject({
      id: 'student-it-001',
      name: '张三',
      idCardMasked: '110101********1234',
    });
    expect(profile.summary).toMatchObject({
      totalHours: 156,
      certificateCount: 2,
      activeCourseCount: 1,
      annualCredits: 18,
    });
    expect(profile.timeline.map((event) => event.title)).toEqual(
      expect.arrayContaining(['完成《Next.js全栈工程化》课程', '获得《培训合格证明》']),
    );
    expect(profile.timeline.some((event) => event.certificateType === 'qualified')).toBe(true);
    expect(profile.courses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          courseName: 'Next.js全栈工程化',
          hours: 48,
          examResult: '合格',
          status: '已完成',
        }),
      ]),
    );
  });
});
