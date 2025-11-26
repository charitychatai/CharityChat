export default async function handler(req, res) {
  // Set CORS headers to allow requests from your domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required.' });
    }

    const trimmedHistory = messages
      .filter(
        (msg) =>
          msg &&
          typeof msg.role === 'string' &&
          typeof msg.content === 'string' &&
          ['user', 'assistant'].includes(msg.role)
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content.slice(0, 2000)
      }))
      .slice(-20);

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are Charity Chat, a concise but warm AI assistant whose answers are funded by ads and donations. Always keep responses factual and encouraging.'
          },
          ...trimmedHistory
        ]
      })
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text();
      console.error('OpenAI error:', errBody);
      return res.status(502).json({ error: 'Upstream error contacting OpenAI.' });
    }

    const data = await apiRes.json();
    res.json({ reply: data.choices?.[0]?.message?.content ?? 'No reply.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reach OpenAI.' });
  }
}

