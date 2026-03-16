export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/lib/auth";

const aiSchema = z.object({
  childAge: z.number().int().min(5).max(10),
  module: z.enum(["MATH", "TIME_TELLING", "PUBLIC_SPEAKING", "MONEY", "SPELLING", "LIFE_SKILLS"]),
  context: z.string().max(500),
  question: z.string().max(500),
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AGE_PERSONAS: Record<number, string> = {
  5: "You are a warm, patient tutor for a 5-year-old. Use very simple words, lots of encouragement, and short sentences. Use fun emojis. Never say anything scary or complicated.",
  6: "You are a friendly tutor for a 6-year-old. Keep language simple and cheerful. Use examples they'd know like toys, food, and animals.",
  7: "You are an encouraging tutor for a 7-year-old. Be enthusiastic and playful. Give simple explanations with relatable examples.",
  8: "You are an enthusiastic tutor for an 8-year-old. You can use slightly more complex words but keep things fun and encouraging.",
  9: "You are a helpful tutor for a 9-year-old. You can explain concepts clearly with real-world examples. Stay positive and encouraging.",
  10: "You are a knowledgeable tutor for a 10-year-old. You can use proper vocabulary and give detailed but friendly explanations.",
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = aiSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const { childAge, module, context, question } = parsed.data;
    const persona = AGE_PERSONAS[childAge] ?? AGE_PERSONAS[7];

    const systemPrompt = `${persona}

You are helping a child learn ${module.replace("_", " ").toLowerCase()}.
Current context: ${context}

Rules:
- Keep responses SHORT (2-4 sentences max)
- Always be encouraging, never make them feel bad
- If they get something wrong, gently guide them to the right answer
- Use age-appropriate language for a ${childAge}-year-old
- Add 1-2 fun emojis to make it friendly
- Never give the answer directly — guide them to discover it`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    });

    const text = message.content[0]?.type === "text" ? message.content[0].text : "";
    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("[ai]", error);
    return NextResponse.json({ message: "AI unavailable" }, { status: 500 });
  }
}
