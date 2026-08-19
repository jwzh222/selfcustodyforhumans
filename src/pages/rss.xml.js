import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const docs = await getCollection('docs');
  const items = docs
    .filter((e) => e.id !== 'home' && !e.data.draft && e.data.date)
    .map((e) => ({
      title: e.data.title,
      description: e.data.description,
      link: new URL('/' + e.id, context.site).href,
      pubDate: e.data.date,
    }));

  return rss({
    title: 'Self custody · 比特币自托管',
    description: '面向非技术人群的比特币自托管指南：bip39 助记词 + passphrase，简单又安全。',
    site: context.site,
    items,
  });
}
