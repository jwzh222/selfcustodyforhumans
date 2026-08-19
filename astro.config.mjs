// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 部署域名（sitemap / RSS / canonical / OG 都依赖它）
  site: 'https://wecanselfcustody.com',
  output: 'static',
  // 干净 URL：/for-mom/create-wallet/random（无尾斜杠）
  trailingSlash: 'never',
  markdown: {
    shikiConfig: {
      // 代码高亮主题，匹配现有深色代码块（.md pre { background:#222 }）
      theme: 'github-dark',
    },
  },
  integrations: [sitemap()],
});
