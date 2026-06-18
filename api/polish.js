/**
 * Vercel Serverless Function — POST /api/polish
 * Keeps ANTHROPIC_API_KEY server-side; never exposed to the browser.
 * Add the key in: Vercel Dashboard → Project → Settings → Environment Variables
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, relation, rawMessage } = req.body ?? {}
  if (!rawMessage) return res.status(400).json({ error: 'rawMessage required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in Vercel env vars' })

  const system = `You are an elegant wordsmith helping guests write heartfelt birthday messages for a woman named Dara.
Refine the guest's raw wish into something beautifully written — warm, sincere, and poetic but not overwrought.
Keep the author's genuine sentiment intact. Return ONLY the polished message, 2-4 sentences, no preamble.`

  const user = `Guest: ${name} (${relation})\nOriginal message: "${rawMessage}"\n\nPlease polish this into a beautiful birthday message for Dara.`

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    })

    if (!upstream.ok) {
      const err = await upstream.text()
      return res.status(502).json({ error: 'Upstream error', detail: err })
    }

    const data = await upstream.json()
    const polished = data?.content?.[0]?.text?.trim() ?? rawMessage
    return res.status(200).json({ polished })
  } catch (err) {
    return res.status(500).json({ error: 'Internal error', detail: err.message })
  }
}
