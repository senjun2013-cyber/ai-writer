import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODE_PROMPTS = {
  improve: "Improve the following text to make it clearer, more engaging, and polished. Preserve the original meaning.",
  email: "Write a professional, well-structured email based on the following content or instructions.",
  blog: "Write a compelling, engaging blog post section based on the following topic or notes. Use subheadings if needed.",
  social: "Write a punchy, engaging social media caption (suitable for LinkedIn, Twitter, or Instagram) based on the following.",
  expand: "Expand the following idea into a rich, well-developed paragraph or short section with depth and examples.",
  summarize: "Summarize the following text into 3–5 clear, concise sentences that capture all key points.",
  rewrite: "Rewrite the following text in simpler, plain language that anyone can understand. Remove jargon.",
  headline: "Generate 5 compelling, click-worthy headlines or subject lines based on the following topic.",
  cta: "Write 3 strong call-to-action statements based on the following product or service description.",
  seo: "Rewrite the following text to be SEO-optimized with natural keyword usage, engaging tone, and clear structure.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { text, mode, tone, plan } = req.body;

  if (!text || text.trim().length < 3) {
    return res.status(400).json({ error: "Please provide some text to work with." });
  }

  // Free plan: limit to 3 uses per session (tracked client-side)
  // Pro plan: unlimited (in production, verify via Stripe/LemonSqueezy webhook)
  const maxTokens = plan === "pro" ? 1500 : 600;

  const prompt = `${MODE_PROMPTS[mode] || MODE_PROMPTS.improve}

Tone: ${tone || "professional"}

${text}

Output only the written result. No preamble, no explanation, no labels.`;

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });

    const result = message.content[0]?.text || "";
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI service error. Please try again." });
  }
}
