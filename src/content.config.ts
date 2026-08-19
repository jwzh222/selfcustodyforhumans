import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 内容集合：src/content/docs/ 目录下的所有 markdown
 * 文件相对路径 = 路由，例如：
 *   src/content/docs/for-mom/create-wallet/random.md
 *   → 路由 /for-mom/create-wallet/random
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    // 必填：页面 <title> 与面包屑末级标签
    title: z.string(),
    // SEO meta description / RSS 摘要
    description: z.string().optional(),
    // 发布日期 / 更新日期（RSS 与结构化数据用）
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    // 草稿不发布
    draft: z.boolean().optional().default(false),
    // 兄弟间排序（默认按 nav.ts 顺序）
    order: z.number().optional(),
    // 覆盖 nav.ts 的侧边栏显示标签
    sidebarLabel: z.string().optional(),
    // 侧边栏等宽字体（passphrase / electrum 等英文词）
    mono: z.boolean().optional(),
    // 手动覆盖上一篇 / 下一篇（路由路径）
    prev: z.string().optional(),
    next: z.string().optional(),
  }),
});

export const collections = { docs };
