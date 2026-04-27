const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-5.5';

  if (!apiKey) {
    return jsonResponse(500, { error: 'OPENAI_API_KEY is not configured in Netlify environment variables.' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON request body.' });
  }

  const productUpdate = cleanString(body.productUpdate);
  const audience = cleanString(body.audience);
  const tone = cleanString(body.tone);
  const platforms = Array.isArray(body.platforms)
    ? body.platforms.filter((platform) => ['x', 'facebook', 'linkedin'].includes(platform))
    : [];

  if (!productUpdate) return jsonResponse(400, { error: 'Product update is required.' });
  if (!audience || !tone) return jsonResponse(400, { error: 'Audience and tone are required.' });
  if (!platforms.length) return jsonResponse(400, { error: 'Select at least one platform.' });

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: 'system',
            content: [{
              type: 'input_text',
              text: [
                'You are ScoutEdge Content Ops Agent.',
                'Create platform-specific social media drafts from ScoutEdge product updates.',
                'Return only valid JSON matching the provided schema.',
                'Do not include markdown or commentary.',
                'X drafts should be short, sharp, and high-hook.',
                'Facebook drafts should be slightly longer and community-friendly.',
                'LinkedIn drafts should be professional and product/founder-oriented.',
                'Do not invent unavailable features, customer claims, partnerships, metrics, or launch dates.'
              ].join(' ')
            }]
          },
          {
            role: 'user',
            content: [{
              type: 'input_text',
              text: JSON.stringify({ productUpdate, audience, tone, platforms })
            }]
          }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'scoutedge_social_drafts',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                drafts: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      platform: { type: 'string', enum: ['x', 'facebook', 'linkedin'] },
                      text: { type: 'string', minLength: 1 }
                    },
                    required: ['platform', 'text']
                  }
                }
              },
              required: ['drafts']
            }
          }
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return jsonResponse(response.status, { error: data.error?.message || 'OpenAI request failed.' });
    }

    const parsed = parseOpenAIJson(data);
    return jsonResponse(200, { drafts: normalizeDrafts(parsed.drafts, platforms) });
  } catch (error) {
    return jsonResponse(500, { error: error.message || 'Unable to generate drafts.' });
  }
};

function parseOpenAIJson(data) {
  const outputText = data.output_text || data.output?.flatMap((item) => item.content || [])
    .find((content) => content.type === 'output_text')?.text;
  if (!outputText) throw new Error('OpenAI returned no draft content.');
  return JSON.parse(outputText);
}

function normalizeDrafts(drafts, platforms) {
  const allowed = new Set(platforms);
  const seen = new Set();
  return (Array.isArray(drafts) ? drafts : [])
    .filter((draft) => allowed.has(draft.platform))
    .filter((draft) => {
      if (seen.has(draft.platform)) return false;
      seen.add(draft.platform);
      return true;
    })
    .map((draft) => ({ platform: draft.platform, text: cleanString(draft.text), status: 'hold' }));
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  };
}
