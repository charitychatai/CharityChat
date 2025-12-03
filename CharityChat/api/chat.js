export default async function handler(req, res) {
  try {
    // Set CORS and JSON headers first
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

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
      return res.status(502).json({ error: 'OpenAI API error', details: errBody.substring(0, 200) });
    }

    const data = await apiRes.json();
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content ?? 'No reply.' });
    
  } catch (error) {
    console.error('API Handler Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error?.message || 'Unknown error'
    });
  }
}

