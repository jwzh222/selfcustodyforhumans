# Self custody · 简单安全的比特币自托管

面向非技术人群（父母、配偶等）的比特币自托管教育网站。核心方案：**bip39 助记词 + passphrase**。基于 **Astro 静态生成器**，每篇文章生成独立网页（SEO 友好），部署在 Cloudflare Pages。

## 快速开始

```bash
npm install
npm run dev        # 本地预览 → http://localhost:4321
```

写内容时不需要碰代码：在 `src/content/docs/` 下编辑 / 新建 Markdown 文件即可，刷新浏览器即见效果。

## 目录结构

```
├── astro.config.mjs        # site / trailingSlash / Shiki / sitemap
├── src/
│   ├── content.config.ts   # 内容集合 schema（frontmatter 定义）
│   ├── content/docs/       # ★ 全部文章（Markdown），路径 = URL
│   ├── data/nav.ts         # 目录树（增删导航改这里）
│   ├── layouts/            # BaseLayout（外壳+SEO head）/ DocLayout（文章页）
│   ├── components/         # Sidebar/Topbar/SearchModal/Breadcrumb/Toc/PrevNext/…
│   ├── scripts/            # 折叠 / 阅读进度 / 搜索 客户端脚本
│   ├── styles/             # global.css（设计令牌）+ fonts.css（自托管字体）
│   └── pages/              # index / [...slug] 文档路由 / rss / robots / 404
├── public/
│   ├── assets/             # SVG 图标 + fonts/
│   ├── tools/              # ★ 你的投骰子等 HTML 工具（放这里）
│   ├── videos/             # ★ 未来自托管 mp4
│   └── _headers            # Cloudflare Pages 响应头
└── TEMPLATE.md             # 文章模板
```

## 写作（只管 Markdown）

1. 找到页面路由，在 `src/content/docs/` 下新建同名文件。例：
   - 路由 `for-mom/create-wallet/random` → 文件 `src/content/docs/for-mom/create-wallet/random.md`
2. 文件开头必须有一段 frontmatter（`title` 必填）：

   ```markdown
   ---
   title: 随机数
   description: 一句话 SEO 摘要（可选，建议填）
   date: 2026-08-19      # 可选：发布日期（用于 RSS）
   draft: false
   ---

   正文从这里开始，Markdown 语法……
   ```

3. 缺失或空正文的页面自动显示「内容待添加」。参考 `TEMPLATE.md`。

- 视频嵌入：正文直接写 `<video controls src="/videos/xxx.mp4"></video>`（mp4 放 `public/videos/`）。
- 工具嵌入：`<iframe src="/tools/xxx.html"></iframe>`（工具 html 放 `public/tools/`）。
- 站内搜索：已内置 Pagefind（中文分词），顶栏「搜索」按钮。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 本地开发预览 |
| `npm run build` | 构建到 `dist/`（含 Pagefind 中文索引） |
| `npm run preview` | 预览构建产物 |

## 上线（Cloudflare Pages）

1. 域名 **selfcustodyforhumans.com** 在 [Cloudflare Registrar](https://dash.cloudflare.com) 注册（约 $10.6/年），DNS 托管在 Cloudflare。
2. 代码推到 GitHub 私有仓库。
3. Cloudflare Pages 关联该仓库，构建配置：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
   - 环境：Node 22（或更高）
4. 绑定自定义域名，自动 HTTPS。

**国内访问**：比特币/自托管内容无法在国内服务器备案托管，本站走 Cloudflare 全球边缘尽力加速（大陆用户路由到最近的香港/日本节点，通常免翻墙可访问）。日后若变慢，可加 BunnyCDN 香港边缘。

## 评论区（接口位已预留）

文章页已预留 `<div id="comments">`。上线后二选一：
- **Twikoo**（Cloudflare Workers 部署，有管理后台）
- **Cloudflare Workers + D1** 自建 HN 式评论区

需要时让 Claude 接入即可。

## 设计还原

设计稿：[Figma · self-custody](https://www.figma.com/design/25g8ct04gEReXaZ5hxd16I/self-custody)

| 元素 | 取值 |
| --- | --- |
| 侧边栏 | `#eee`，260px，右边框 `#e2e2e2` |
| 品牌头 | `#2f3131`，Space Grotesk `#f1f1f1` |
| for mom 强调块 | 底 `#e2e2e2`，左 4px 橙边框 `#f7931a` |
| 中文正文 | 系统中文栈（文泉驿正黑 → 苹方 → 微软雅黑） |
| 等宽字体 | JetBrains Mono（自托管，无外链） |
