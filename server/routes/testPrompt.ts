import { Router, Request, Response } from 'express';

const router = Router();

interface TestPromptRequest {
  apiKey: string;
  provider: 'openai' | 'anthropic';
  systemPrompt: string;
  userMessage: string;
}

// Test prompt endpoint
router.post('/test-prompt', async (req: Request, res: Response) => {
  try {
    const { apiKey, provider, systemPrompt, userMessage } = req.body as TestPromptRequest;

    if (!apiKey || !provider || !systemPrompt || !userMessage) {
      return res.status(400).json({ error: 'Paramètres manquants' });
    }

    let response: string;

    if (provider === 'openai') {
      response = await testWithOpenAI(apiKey, systemPrompt, userMessage);
    } else if (provider === 'anthropic') {
      response = await testWithAnthropic(apiKey, systemPrompt, userMessage);
    } else {
      return res.status(400).json({ error: 'Provider non supporté' });
    }

    res.json({ response });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ error: errorMsg });
  }
});

async function testWithOpenAI(apiKey: string, systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erreur OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function testWithAnthropic(apiKey: string, systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erreur Anthropic');
  }

  const data = await response.json();
  return data.content[0].text;
}

export default router;
