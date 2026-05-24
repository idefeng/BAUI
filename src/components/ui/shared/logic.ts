/** 将数值限制在指定区间内，集中处理进度、分页等边界保护。 */
export const clampNumber = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** 将数值向下取整后限制下限，适合页数、列数、星级数量等正整数边界。 */
export const floorAtLeast = (value: number, min = 1) => Math.max(min, Math.floor(value));

/** 将数值四舍五入后限制下限，适合文件大小等展示型整数边界。 */
export const roundAtLeast = (value: number, min = 1) => Math.max(min, Math.round(value));

/** 判断树形节点是否存在子级，避免各树控件重复书写 children 判空逻辑。 */
export const hasChildItems = <T extends { children?: unknown[] }>(item: T) => Boolean(item.children?.length);
