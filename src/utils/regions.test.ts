import { describe, expect, it } from 'vitest';

import {
  getRegionOptions,
  getRegionPath,
  getRegionValuePath,
  mockRegionValuePath,
  regionOptions,
} from './regions';

describe('region base data center', () => {
  it('提供轻量化全国省市区三级行政区划树', () => {
    expect(regionOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: '110000',
          label: '北京市',
        }),
        expect.objectContaining({
          value: '440000',
          label: '广东省',
        }),
      ]),
    );
    expect(regionOptions.find((option) => option.value === '440000')?.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: '440100',
          label: '广州市',
        }),
      ]),
    );
  });

  it('能根据末端 Adcode 反推出完整中文路径与 value 路径', () => {
    expect(getRegionPath('440106')).toEqual(['广东省', '广州市', '天河区']);
    expect(getRegionValuePath('440106')).toEqual(['440000', '440100', '440106']);
    expect(getRegionPath('999999')).toEqual([]);
  });

  it('能按省市区层级裁剪 Cascader 数据并生成一键填表路径', () => {
    const cityOptions = getRegionOptions('CITY');
    const guangdong = cityOptions.find((option) => option.value === '440000');
    const guangzhou = guangdong?.children?.find((option) => option.value === '440100');

    expect(guangzhou?.children).toBeUndefined();
    expect(mockRegionValuePath(1, 'DISTRICT')).toHaveLength(3);
    expect(mockRegionValuePath(1, 'CITY')).toHaveLength(2);
    expect(mockRegionValuePath(1, 'PROVINCE')).toHaveLength(1);
  });
});
