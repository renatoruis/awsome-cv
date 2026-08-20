import type { APIRoute } from 'astro';
import { jsonResponse, toJsonResume } from '../lib/ai-exports';
import { cvs } from '../lib/cv';

export const GET: APIRoute = () => jsonResponse(toJsonResume(cvs.en));
