import type { APIRoute } from 'astro';
import { markdownResponse, toMarkdown } from '../lib/ai-exports';
import { LOCALES, getCv } from '../lib/cv';

export function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}

export const GET: APIRoute = ({ params }) => {
  const cv = getCv(params.locale);
  if (!cv) return new Response('Not found', { status: 404 });
  return markdownResponse(toMarkdown(cv));
};
