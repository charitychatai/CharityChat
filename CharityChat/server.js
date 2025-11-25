import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body ?? {};
    if (!message) {
      return res.status(400).json({ error: 'Message required.' });
    }

    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a friendly assistant for a charity-funded site.' },
          { role: 'user', content: message }
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
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`CharityChat live on http://localhost:${port}`);
});


