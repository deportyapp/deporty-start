import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const pages = ['/', '/login', '/register', '/onboarding'];

export const GET: RequestHandler = async ({ url }) => {
    const origin = url.origin;
    const urls = pages
        .map((path) => {
            return `  <url><loc>${origin}${path}</loc></url>`;
        })
        .join('\n');

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `${urls}\n` +
        `</urlset>`;

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml',
        }
    });
};
