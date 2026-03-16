export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildAIContext } from "@/lib/personalisation";

const aiSchema = z.object({
  childAge:  z.number().int().min(5).max(10),
  module:    z.enum(["MATH","TIME_TELLING","PUBLIC_SPEAKING","MONEY","SPELLING","LIFE_SKILLS"]),
  context:   z.string().max(500),
  question:  z.string().max(500),
});

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AGE_PERSONAS: Record<number, string> = {
  5:  "You are tutoring a 5-year-old. Use very simple words, lots of encouragement, and short sentences.",
  6:  "You are tutoring a 6-year-old. Keep language simple and cheerful with relatable examples.",
  7:  "You are tutoring a 7-year-old. Be enthusiastic and playful with simple explanations.",
  8:  "You are tutoring an 8-year-old. Use slightly more complex words but stay fun and encouraging.",
  9:  "You are tutoring a 9-year-old. Give clear explanations with real-world examples.",
  10: "You are tutoring a 10-year-old. Use proper vocabulary with friendly, detailed explanations.",
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

    // Fetch child personalisation if available
    const childId = (session.user as any).id;
    const role    = (session.user as any).role;
    let childData: any = null;

    if (role === "child") {
      try {
        childData = await prisma.child.findUnique({
          where: { id: childId },
          select: { name: true, nickname: true, favoriteGame: true, learningStyle: true, favoriteAnimal: true, mascotName: true, age: true },
        });
      } catch (e) { /* non-fatal */ }
    }

    const basePersona = AGE_PERSONAS[childAge] ?? AGE_PERSONAS[7];
    const personalisedContext = childData
      ? buildAIContext({ ...childData, age: childAge }, module)
      : "";

    const systemPrompt = `${basePersona}
${personalisedContext}

Subject: ${module.replace(/_/g, " ").toLowerCase()}
Current context: ${context}

Rules:
- Keep responses SHORT — 2–4 sentences maximum
- NEVER give the answer directly — guide them to discover it
- Always be encouraging, never make the child feel bad
- Use 1–2 fun emojis to keep it friendly
- If they got it wrong, gently redirect with a helpful clue
- Reference their favourite game or mascot naturally when relevant`;

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
