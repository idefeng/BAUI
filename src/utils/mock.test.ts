import { describe, expect, it } from 'vitest';

import {
  mockCascaderOptions,
  mockCertificate,
  mockCourses,
  mockLearningProfile,
  mockPickTechnologyInterests,
  mockProjects,
  mockSelectOptions,
  mockSwitchChecked,
  mockTechnologyInterestOptions,
  mockTrainingScheduleDateTime,
  mockUsers,
} from './mock';

describe('mock data workshop', () => {
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
