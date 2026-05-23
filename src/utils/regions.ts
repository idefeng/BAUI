export type BaRegionLevel = 'PROVINCE' | 'CITY' | 'DISTRICT';

export interface RegionOption {
  /** 行政区划国标代码 Adcode。 */
  value: string;
  /** 行政区划中文名称。 */
  label: string;
  /** 下级行政区划；省级节点下挂市，市级节点下挂区县。 */
  children?: RegionOption[];
}

const regionLevelOrder: BaRegionLevel[] = ['PROVINCE', 'CITY', 'DISTRICT'];

/** 轻量化全国省市区基础库，优先覆盖公司项目中高频的一二线城市群。 */
export const regionOptions: RegionOption[] = [
  {
    value: '110000',
    label: '北京市',
    children: [
      {
        value: '110100',
        label: '北京市',
        children: [
          { value: '110101', label: '东城区' },
          { value: '110102', label: '西城区' },
          { value: '110105', label: '朝阳区' },
          { value: '110106', label: '丰台区' },
          { value: '110108', label: '海淀区' },
        ],
      },
    ],
  },
  {
    value: '310000',
    label: '上海市',
    children: [
      {
        value: '310100',
        label: '上海市',
        children: [
          { value: '310101', label: '黄浦区' },
          { value: '310104', label: '徐汇区' },
          { value: '310112', label: '闵行区' },
          { value: '310115', label: '浦东新区' },
        ],
      },
    ],
  },
  {
    value: '440000',
    label: '广东省',
    children: [
      {
        value: '440100',
        label: '广州市',
        children: [
          { value: '440104', label: '越秀区' },
          { value: '440106', label: '天河区' },
          { value: '440112', label: '黄埔区' },
          { value: '440113', label: '番禺区' },
        ],
      },
      {
        value: '440300',
        label: '深圳市',
        children: [
          { value: '440304', label: '福田区' },
          { value: '440305', label: '南山区' },
          { value: '440306', label: '宝安区' },
          { value: '440307', label: '龙岗区' },
        ],
      },
      {
        value: '440600',
        label: '佛山市',
        children: [
          { value: '440604', label: '禅城区' },
          { value: '440605', label: '南海区' },
          { value: '440606', label: '顺德区' },
        ],
      },
    ],
  },
  {
    value: '320000',
    label: '江苏省',
    children: [
      {
        value: '320100',
        label: '南京市',
        children: [
          { value: '320102', label: '玄武区' },
          { value: '320104', label: '秦淮区' },
          { value: '320106', label: '鼓楼区' },
          { value: '320115', label: '江宁区' },
        ],
      },
      {
        value: '320500',
        label: '苏州市',
        children: [
          { value: '320505', label: '虎丘区' },
          { value: '320506', label: '吴中区' },
          { value: '320508', label: '姑苏区' },
          { value: '320509', label: '吴江区' },
        ],
      },
    ],
  },
  {
    value: '330000',
    label: '浙江省',
    children: [
      {
        value: '330100',
        label: '杭州市',
        children: [
          { value: '330102', label: '上城区' },
          { value: '330106', label: '西湖区' },
          { value: '330108', label: '滨江区' },
          { value: '330110', label: '余杭区' },
        ],
      },
      {
        value: '330200',
        label: '宁波市',
        children: [
          { value: '330203', label: '海曙区' },
          { value: '330206', label: '北仑区' },
          { value: '330212', label: '鄞州区' },
        ],
      },
    ],
  },
  {
    value: '510000',
    label: '四川省',
    children: [
      {
        value: '510100',
        label: '成都市',
        children: [
          { value: '510104', label: '锦江区' },
          { value: '510105', label: '青羊区' },
          { value: '510107', label: '武侯区' },
          { value: '510108', label: '成华区' },
        ],
      },
      {
        value: '510700',
        label: '绵阳市',
        children: [
          { value: '510703', label: '涪城区' },
          { value: '510704', label: '游仙区' },
        ],
      },
    ],
  },
  {
    value: '420000',
    label: '湖北省',
    children: [
      {
        value: '420100',
        label: '武汉市',
        children: [
          { value: '420102', label: '江岸区' },
          { value: '420106', label: '武昌区' },
          { value: '420111', label: '洪山区' },
          { value: '420112', label: '东西湖区' },
        ],
      },
      {
        value: '420500',
        label: '宜昌市',
        children: [
          { value: '420502', label: '西陵区' },
          { value: '420503', label: '伍家岗区' },
        ],
      },
    ],
  },
  {
    value: '370000',
    label: '山东省',
    children: [
      {
        value: '370100',
        label: '济南市',
        children: [
          { value: '370102', label: '历下区' },
          { value: '370103', label: '市中区' },
          { value: '370112', label: '历城区' },
        ],
      },
      {
        value: '370200',
        label: '青岛市',
        children: [
          { value: '370202', label: '市南区' },
          { value: '370203', label: '市北区' },
          { value: '370212', label: '崂山区' },
        ],
      },
    ],
  },
];

const getNextLevel = (level: BaRegionLevel) => regionLevelOrder[regionLevelOrder.indexOf(level) + 1];

const cloneRegionTree = (nodes: RegionOption[], targetLevel: BaRegionLevel, currentLevel: BaRegionLevel): RegionOption[] =>
  nodes.map((node) => {
    if (currentLevel === targetLevel || !node.children?.length) {
      return { value: node.value, label: node.label };
    }

    return {
      value: node.value,
      label: node.label,
      children: cloneRegionTree(node.children, targetLevel, getNextLevel(currentLevel) ?? 'DISTRICT'),
    };
  });

const findRegionPathNodes = (
  nodes: RegionOption[],
  adcode: string,
  currentPath: RegionOption[] = [],
): RegionOption[] => {
  for (const node of nodes) {
    const nextPath = [...currentPath, node];

    if (node.value === adcode) {
      return nextPath;
    }

    if (node.children?.length) {
      const matchedPath = findRegionPathNodes(node.children, adcode, nextPath);

      if (matchedPath.length > 0) {
        return matchedPath;
      }
    }
  }

  return [];
};

const collectRegionValuePaths = (
  nodes: RegionOption[],
  targetLevel: BaRegionLevel,
  currentLevel: BaRegionLevel,
  currentPath: string[] = [],
): string[][] =>
  nodes.flatMap((node) => {
    const nextPath = [...currentPath, node.value];

    if (currentLevel === targetLevel || !node.children?.length) {
      return [nextPath];
    }

    return collectRegionValuePaths(node.children, targetLevel, getNextLevel(currentLevel) ?? 'DISTRICT', nextPath);
  });

/** 按目标层级裁剪行政区划树，供 Cascader 控制省/市/区选择深度。 */
export const getRegionOptions = (level: BaRegionLevel = 'DISTRICT'): RegionOption[] =>
  cloneRegionTree(regionOptions, level, 'PROVINCE');

/** 根据任意已收录 Adcode 反推出中文路径，例如 440106 -> 广东省/广州市/天河区。 */
export const getRegionPath = (adcode: string): string[] =>
  findRegionPathNodes(regionOptions, adcode).map((node) => node.label);

/** 根据任意已收录 Adcode 反推出 value 路径，适配 Cascader 受控值。 */
export const getRegionValuePath = (adcode: string): string[] =>
  findRegionPathNodes(regionOptions, adcode).map((node) => node.value);

/** 为表单一键填表生成稳定的真实区划路径，seed 相同则输出稳定。 */
export const mockRegionValuePath = (seed = Date.now(), level: BaRegionLevel = 'DISTRICT'): string[] => {
  const valuePaths = collectRegionValuePaths(regionOptions, level, 'PROVINCE');

  if (valuePaths.length === 0) {
    return [];
  }

  return [...valuePaths[Math.abs(Math.floor(seed)) % valuePaths.length]];
};
