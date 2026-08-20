import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = 'https://cv.timdevops.com.br';
const locales = ['en', 'pt-pt', 'pt-br'];

export default defineConfig({
  site,
  integrations: [
    sitemap({
      customPages: [
        `${site}/llms.txt`,
        `${site}/llms-full.txt`,
        `${site}/resume.json`,
        ...locales.flatMap((locale) => [
          `${site}/${locale}.md`,
          `${site}/${locale}.json`,
          `${site}/${locale}/resume.json`,
        ]),
      ],
    }),
  ],
});
