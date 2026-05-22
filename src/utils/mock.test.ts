import { describe, expect, it } from 'vitest';

import { mockCourses, mockProjects, mockSelectOptions, mockUsers } from './mock';

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
});
