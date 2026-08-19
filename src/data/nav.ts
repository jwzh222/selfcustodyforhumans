/**
 * 目录导航数据（真源）与辅助函数
 * 结构：
 *   for mom（强调区块）
 *     1. 创建钱包（助记词+passphrase）→ 随机数 / 什么是好的passphrase
 *     2. 保存助记词 → 纸 / 铁片
 *     3. 使用钱包 → 旧手机安装electrum
 *   for 高级用户
 *   附录 → 1. abc / 2. cdb
 *   Tools
 */

export interface NavLeaf {
  id: string;
  label: string;
  mono?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  children: NavLeaf[];
}

export interface NavSection {
  id: string;
  label: string;
  accent?: boolean;                 // for mom：橙色左边框强调块
  bordered?: boolean | 'bottom';    // 顶部/底部边框
  indented?: boolean;               // 缩进行（附录 / Tools）
  collapsible?: boolean;            // 可折叠
  icon?: string;                    // 图标路径（public/assets/…）
  iconClass?: string;
  children?: (NavGroup | NavLeaf)[];
}

export const NAV: NavSection[] = [
  {
    id: 'for-mom',
    label: 'for mom',
    accent: true,
    collapsible: true,
    children: [
      {
        id: 'create-wallet',
        label: '1. 创建钱包（助记词+passphrase）',
        children: [
          { id: 'random', label: '随机数' },
          { id: 'good-passphrase', label: '什么是好的passphrase', mono: true },
        ],
      },
      {
        id: 'save-seed',
        label: '2. 保存助记词',
        children: [
          { id: 'paper', label: '纸' },
          { id: 'metal', label: '铁片' },
        ],
      },
      {
        id: 'use-wallet',
        label: '3. 使用钱包',
        children: [
          { id: 'old-phone-electrum', label: '旧手机安装electrum', mono: true },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    label: 'for 高级用户',
    bordered: true,
    collapsible: false,
  },
  {
    id: 'appendix',
    label: '附录',
    icon: '/assets/appendix-icon.svg',
    bordered: 'bottom',
    indented: true,
    collapsible: true,
    children: [
      { id: 'abc', label: '1. abc' },
      { id: 'cdb', label: '2. cdb' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: '/assets/tools-icon.svg',
    iconClass: 'tools',
    bordered: 'bottom',
    indented: true,
    collapsible: false,
  },
];

/** 拍平的叶子（含顶级独立页面），顺序即线性阅读顺序 */
export interface FlatEntry {
  route: string;
  label: string;
  mono: boolean;
  sectionId: string;
}

export const FLAT: FlatEntry[] = (() => {
  const flat: FlatEntry[] = [];
  for (const section of NAV) {
    if (section.children && section.children.length) {
      for (const group of section.children) {
        if ('children' in group && group.children) {
          for (const leaf of group.children) {
            flat.push({
              route: `${section.id}/${group.id}/${leaf.id}`,
              label: leaf.label,
              mono: !!leaf.mono,
              sectionId: section.id,
            });
          }
        } else {
          const leaf = group as NavLeaf;
          flat.push({
            route: `${section.id}/${leaf.id}`,
            label: leaf.label,
            mono: !!leaf.mono,
            sectionId: section.id,
          });
        }
      }
    } else {
      // 无子项的顶级项（for 高级用户 / Tools）自身即页面
      flat.push({
        route: section.id,
        label: section.label,
        mono: false,
        sectionId: section.id,
      });
    }
  }
  return flat;
})();

const byRoute = new Map(FLAT.map((e) => [e.route, e]));

export function labelFor(route: string): string | undefined {
  return byRoute.get(route)?.label;
}

/** 面包屑分段：顶级章节 → 分组 → 当前页 */
export interface Crumb {
  label: string;
  route?: string; // 可点击时给出（仅当该段是页面）
}

export function sectionsFor(route: string): Crumb[] {
  const crumbs: Crumb[] = [{ label: '首页', route: '/' }];
  const parts = route.split('/');
  if (parts.length === 1) {
    const label = labelFor(route);
    if (label) crumbs.push({ label, route: '/' + route });
    return crumbs;
  }
  // 顶部章节名（for-mom / appendix）
  const section = NAV.find((s) => s.id === parts[0]);
  if (section) crumbs.push({ label: section.label });
  // 分组名（1.创建钱包 等）
  const group = section?.children?.find(
    (g) => 'children' in g && g.id === parts[1]
  ) as NavGroup | undefined;
  if (group) crumbs.push({ label: group.label });
  // 当前页
  const entry = byRoute.get(route);
  if (entry) crumbs.push({ label: entry.label, route: '/' + route });
  return crumbs;
}

/** 上一篇 / 下一篇（按 FLAT 线性顺序） */
export function prevNext(route: string): { prev?: FlatEntry; next?: FlatEntry } {
  const idx = FLAT.findIndex((e) => e.route === route);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? FLAT[idx - 1] : undefined,
    next: idx < FLAT.length - 1 ? FLAT[idx + 1] : undefined,
  };
}

/** 当前路由所属章节 id（用于折叠联动与面包屑） */
export function sectionIdOf(route: string): string | undefined {
  return byRoute.get(route)?.sectionId;
}
