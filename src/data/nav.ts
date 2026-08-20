/**
 * 目录导航数据（真源）与辅助函数
 * 结构：
 *   for mom（强调区块，三节无编号）
 *     创建钱包（主页 + 两小节）
 *       1. 助记词
 *         1. 助记词是高风险环节
 *         2. 投骰子很快
 *       2. passphrase
 *     备份钱包 → 纸 / 铁片
 *     使用钱包 → 旧手机安装electrum
 *   for 高级用户
 *   附录 → 1. abc / 2. cdb
 *   Tools
 *
 * 分组（NavGroup）可嵌套：children 既可以是叶子也可以是子分组，
 * 深度不限；有 href 的分组头即链接（点击打开对应 md 主页）。
 */

export interface NavLeaf {
  id: string;
  label: string;
  mono?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  href?: string;                            // 分组头即链接（点击打开对应 md 主页）
  children: (NavGroup | NavLeaf)[];         // 支持嵌套分组
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
        label: '创建钱包',
        href: '/for-mom/create-wallet/create-wallet',
        children: [
          {
            id: 'mnemonic',
            label: '1. 助记词',
            children: [
              { id: 'mnemonic-risk', label: '1. 助记词是高风险环节' },
              { id: 'dice-fast', label: '2. 投骰子很快' },
            ],
          },
          { id: 'good-passphrase', label: '2. passphrase' },
        ],
      },
      {
        id: 'backup-wallet',
        label: '备份钱包',
        href: '/for-mom/backup-wallet/backup-wallet',
        children: [
          { id: 'paper', label: '纸' },
          { id: 'metal', label: '铁片' },
        ],
      },
      {
        id: 'use-wallet',
        label: '使用钱包',
        href: '/for-mom/use-wallet/use-wallet',
        children: [
          { id: 'old-phone-electrum', label: '旧手机安装electrum', mono: true },
        ],
      },
    ],
  },
  {
    id: 'advanced',
    label: 'blog',
    bordered: true,
    collapsible: false,
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: '/assets/tools-icon.svg',
    iconClass: 'tools',
    bordered: 'bottom',
    collapsible: false,
    children: [
      { id: 'roll-seeds', label: 'Roll Seeds · 掷骰子生成助记词' },
    ],
  },
];

/** 拍平的叶子（含分组主页），顺序即线性阅读顺序 */
export interface FlatEntry {
  route: string;
  label: string;
  mono: boolean;
  sectionId: string;
}

/** 递归收集所有可访问节点：分组主页（有 href 时）+ 叶子 */
function collect(
  sectionId: string,
  prefix: string,
  nodes: (NavGroup | NavLeaf)[]
): FlatEntry[] {
  const out: FlatEntry[] = [];
  for (const node of nodes) {
    if ('children' in node && node.children) {
      const grp = node as NavGroup;
      if (grp.href) {
        out.push({
          route: grp.href.replace(/^\//, ''),
          label: grp.label,
          mono: false,
          sectionId,
        });
      }
      out.push(...collect(sectionId, `${prefix}/${grp.id}`, grp.children));
    } else {
      const leaf = node as NavLeaf;
      out.push({
        route: `${prefix}/${leaf.id}`,
        label: leaf.label,
        mono: !!leaf.mono,
        sectionId,
      });
    }
  }
  return out;
}

export const FLAT: FlatEntry[] = (() => {
  const flat: FlatEntry[] = [];
  for (const section of NAV) {
    if (section.children && section.children.length) {
      flat.push(...collect(section.id, section.id, section.children));
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

/** 面包屑分段：顶级章节 → 分组 → … → 当前页（沿路由逐层下行） */
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
  const section = NAV.find((s) => s.id === parts[0]);
  if (!section) return crumbs;
  crumbs.push({ label: section.label });

  let nodes = section.children;
  let acc = parts[0];
  for (let i = 1; i < parts.length; i++) {
    const node = nodes?.find((n) => n.id === parts[i]);
    if (!node) break;
    acc += '/' + parts[i];
    if ('children' in node && node.children) {
      const grp = node as NavGroup;
      // 分组主页：当前页正是该主页时，末级不重复且不可点
      const isGroupMain = !!grp.href && grp.href.replace(/^\//, '') === route;
      crumbs.push({ label: grp.label, route: isGroupMain ? undefined : grp.href });
      nodes = node.children;
    } else {
      crumbs.push({ label: node.label, route: '/' + acc });
      break;
    }
  }
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
