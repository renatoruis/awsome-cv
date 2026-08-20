import type { APIRoute } from 'astro';
import { markdownResponse, toLlmsTxt } from '../lib/ai-exports';

export const GET: APIRoute = () => markdownResponse(toLlmsTxt());
