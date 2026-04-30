export const config = {
  runtime: 'edge',   // Faster and better for CORS
};

export default async function handler(req) {
  // Handle preflight OPTIONS request (important for CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY on Vercel" }), {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    const url = new URL(req.url);
    const targetUrl = `https://generativelanguage.googleapis.com${url.pathname.replace('/api/gemini', '')}?key=${GEMINI_API_KEY}`;

    const body = req.method === 'POST' ? await req.text() : null;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
