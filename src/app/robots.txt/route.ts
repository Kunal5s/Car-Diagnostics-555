import {NextRequest, NextResponse} from 'next/server';

const URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002';

export async function GET(req: NextRequest) {
  const robots = `
User-agent: *
Allow: /

Sitemap: ${URL}/sitemap.xml
`.trim();

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
