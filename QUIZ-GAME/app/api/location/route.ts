// app/api/location/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in .env.local");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 备用口号池（≤ 8 词，纯文本）
const FALLBACKS = [
  "Explore learn and thrive",
  "Find your place and grow",
  "Chase curiosity across cities",
  "Discover your best direction",
  "Go further with purpose",
  "Learn boldly live brightly",
  "Dream big explore smarter",
];

function toMaxEightWords(s: string) {
  const cleaned = s
    .replace(/[\u2018\u2019'"\u201C\u201D.,!?;:~`<>()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.split(" ").filter(Boolean).slice(0, 8).join(" ");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { answers = {}, avatar = "unknown" } = body;

    const system = [
      "You are a copywriter.",
      'Write ONE short ENGLISH motto for a student\'s "Location" card.',
      "Constraints:",
      "- At most 8 words",
      "- Plain text only (no quotes, emoji, punctuation)",
      '- Prefer imperative vibe (e.g. Explore learn and thrive)',
      "- No duplicate words if possible",
    ].join("\n");

    const user = [
      `Avatar: ${avatar}`,
      `Answers: ${JSON.stringify(answers)}`,
      "Return ONLY the motto text (<= 8 words).",
    ].join("\n");

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.9,
      max_tokens: 24,
      stop: ["\n"],
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const raw = resp.choices?.[0]?.message?.content?.trim() || FALLBACKS[0];
    const motto = toMaxEightWords(raw);

    return NextResponse.json({ motto });
  } catch (err: any) {
    // ---- 429 / 配额 或 速率受限：返回备用文案而不是 500
    const msg = String(err?.message || "");
    const status = err?.status || err?.statusCode;

    if (status === 429 || /quota|rate limit/i.test(msg)) {
      const motto = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
      console.warn("[/api/location] 429/quota -> fallback motto:", motto);
      return NextResponse.json({ motto: toMaxEightWords(motto), fallback: true });
    }

    console.error("[/api/location] error:", err);
    return NextResponse.json({ error: "Failed to generate motto" }, { status: 500 });
  }
}
