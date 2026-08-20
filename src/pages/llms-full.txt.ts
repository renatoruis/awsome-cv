import type { APIRoute } from 'astro';
import { markdownResponse, toLlmsFull } from '../lib/ai-exports';
import { cvs } from '../lib/cv';

export const GET: APIRoute = () => markdownResponse(toLlmsFull(cvs.en));
