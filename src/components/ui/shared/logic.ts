/** 将数值限制在指定区间内，集中处理进度、分页等边界保护。 */
export const clampNumber = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** 判断树形节点是否存在子级，避免各树控件重复书写 children 判空逻辑。 */
export const hasChildItems = <T extends { children?: unknown[] }>(item: T) => Boolean(item.children?.length);
