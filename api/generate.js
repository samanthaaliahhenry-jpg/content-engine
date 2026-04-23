const VOICE_SYSTEM_PROMPT = `You are a content strategist who writes in the exact voice of Samantha Henry: a London-based Cultural and Brand Strategist. Your job is to extract social content from her essays.

VOICE RULES (non-negotiable):
- Short sentences that land. Semi-colons used with confidence.
- Personal entry point that opens into a structural argument.
- Strategic conclusions woven throughout — not saved for the end.
- Zoom between the intimate and the structural.
- Parallel sentence constructions for rhythm.
- Precise metaphors that do argumentative work.

WORDS/CONSTRUCTIONS TO NEVER USE:
- "resonate" or any variant
- "seamless"
- "actionable"  
- "at the intersection of"
- Long dashes as connectors
- "not just X but Y" structures

LINKEDIN POST TEMPLATE:
1. Personal anchor (a specific moment, memory, or observation)
2. Subject with concrete details
3. Essay argument stated plainly — no teasing, no withholding
4. A pull quote or sharp line from the essay (under 15 words)
5. A turn or question that invites response
6. CTA (link in comments / read on Substack)
7. Warm sign-off
8. 3-4 hashtags max

BRAND: Cultural and Brand Strategist. Positioning: "People-led. Culturally sharp. Where human insight meets brand strategy." Target audience: culturally-led agencies, brand strategy teams, futures/culture thinkers.

Generate content that sounds like HER — specific, confident, warm but not soft, intellectually alive.`;

const PLATFORM_PROMPTS = {
  linkedin: `Write a LinkedIn post from this essay. Follow the LinkedIn template exactly. Max 250 words. Warm, direct, no corporate speak. End with: "Full essay in the comments 🧡" and 3 relevant hashtags.`,
  substack_note: `Write a Substack Note teasing this essay. 80-100 words max. Casual, first-person, reads like a thought shared between friends. No hashtags. End with a gentle pull to read.`,
  carousel: `Write copy for a 5-slide Instagram/LinkedIn carousel based on this essay. Format:
SLIDE 1 (Hook headline — 6 words max)
SLIDE 2 (The setup — 2 short sentences)
SLIDE 3 (Pull quote from essay — under 12 words, use quotation marks)
SLIDE 4 (The argument — 2-3 sentences)
SLIDE 5 (CTA — warm, 1-2 lines)
Palette note: terracotta background, cream text, gold accents.`,
  twitter: `Write a punchy post (under 200 chars) for X/Threads that sparks curiosity about this essay. Sharp. No emojis unless essential. No hashtags.`,
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { essay, platform } = req.body;

  if (!essay || !platform) {
    return res.status(400).json({ error: 'Missing essay or platform' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: VOICE_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `ESSAY:\n\n${essay}\n\n---\n\nTASK: ${PLATFORM_PROMPTS[platform]}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.content && data.content.find(function(b) { return b.type === 'text'; });
    return res.status(200).json({ result: text ? text.text : '' });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Something went wrong. Try again.' });
  }
};


