import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';

const app = express();
const port = Number(process.env.GIE_AI_PORT || 8787);

app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'GIE AI', timestamp: new Date().toISOString() });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY is missing from .env.' });
    }

    const messages = (Array.isArray(req.body?.messages) ? req.body.messages : [])
      .filter((m) => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .filter((m) => m.content)
      .slice(-30);

    if (!messages.length) {
      return res.status(400).json({ error: 'A message is required.' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const result = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
      instructions:
        'You are the AI inside GIE, the Geometric Intelligence Engine. Follow the user’s requested task and sequence. Help with geometric research, blueprints, engineering documentation, coding, organization, and business operations. Never claim work is complete unless it is actually complete.',
      input: messages,
    });

    const reply = result.output_text?.trim();
    if (!reply) {
      return res.status(502).json({ error: 'The AI returned an empty response.' });
    }

    res.json({ reply, responseId: result.id, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[GIE AI]', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown GIE AI error.',
    });
  }
});

app.listen(port, '127.0.0.1', () => {
  console.log(`GIE AI server: http://127.0.0.1:${port}`);
});
