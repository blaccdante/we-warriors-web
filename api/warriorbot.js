// Serverless proxy for WarriorBot -> OpenAI (ChatGPT)
// Works on Vercel (api/warriorbot.js) and Netlify (netlify/functions/warriorbot.js with minor wrapper).
// NEVER expose API keys to the frontend. Set OPENAI_API_KEY in your hosting provider's env vars.

export default async function handler(req, res) {
  // Allow CORS for local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Missing OPENAI_API_KEY server env var' });
    return;
  }

  try {
    const body = req.body || {};
    const model = body.model || 'gpt-4o-mini';
    const system = body.system || 'You are WarriorBot, an empathetic AI for sickle cell warriors.';
    const history = Array.isArray(body.history) ? body.history : [];
    const message = String(body.message || 'Hello');

    const messages = [
      { role: 'system', content: system },
      ...history.map(h => ({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.message })).slice(-6),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 700,
        stream: false
      })
    });

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({ error: data.error || 'OpenAI error' });
      return;
    }

    const reply = data.choices?.[0]?.message?.content || '';
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Proxy failure', details: err?.message });
  }
}
