import { describe, expect, it } from 'vitest';

import { mockCertificate, mockCourses, mockLearningProfile, mockProjects, mockSelectOptions, mockUsers } from './mock';

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
