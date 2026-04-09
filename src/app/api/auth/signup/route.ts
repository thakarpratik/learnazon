export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/bcrypt";
import { transporter, FROM } from "@/lib/mailer";
import { randomBytes } from "crypto";

const signupSchema = z.object({
  name:          z.string().min(2).max(100),
  email:         z.string().email().toLowerCase(),
  password:      z.string().min(8).max(128),
  plan:          z.enum(["FREE", "PRO", "FAMILY"]).default("FREE"),
  marketingOptIn: z.boolean().default(false),
});

async function addToBrevoList(email: string, name: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_MARKETING_LIST_ID;
  if (!apiKey || !listId) return;
  try {
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: name.split(" ")[0], LASTNAME: name.split(" ").slice(1).join(" ") },
        listIds: [Number(listId)],
        updateEnabled: true,
      }),
    });
  } catch (e) {
    console.error("[brevo contact]", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password, plan, marketingOptIn } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const emailVerifyToken = randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: { name, email, passwordHash, plan, emailVerifyToken, marketingOptIn },
      select: { id: true, email: true, name: true, plan: true },
    });

    // Send verification email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flinchi.com";
    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${emailVerifyToken}`;

    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "Verify your Flinchi account ✉️",
      html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fffbf5;font-family:'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:520px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="font-size:48px;">🌟</span>
    <h1 style="font-size:28px;color:#ff6b35;margin:8px 0 0;font-weight:800;">Welcome to Flinchi!</h1>
    <p style="color:#6b7280;margin:6px 0 0;">Hi ${name.split(" ")[0]}! Just one step to go.</p>
  </div>
  <div style="background:#fff;border-radius:20px;padding:32px;border:1px solid #e5e7eb;text-align:center;">
    <p style="color:#374151;font-size:16px;line-height:1.6;margin:0 0 24px;">
      Click the button below to verify your email address and activate your account.
    </p>
    <a href="${verifyUrl}"
       style="display:inline-block;background:linear-gradient(135deg,#ff6b35,#f97316);color:#fff;padding:16px 40px;border-radius:50px;text-decoration:none;font-weight:800;font-size:17px;">
      Verify my email ✅
    </a>
    <p style="color:#9ca3af;font-size:12px;margin:24px 0 0;">
      Link expires in 24 hours. If you didn't sign up, you can ignore this email.
    </p>
  </div>
</div>
</body>
</html>`,
    });

    // Add to Brevo marketing list if opted in
    if (marketingOptIn) {
      await addToBrevoList(email, name);
    }

    return NextResponse.json({ pendingVerification: true }, { status: 201 });
  } catch (error) {
    console.error("[signup]", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Internal server error", debug: msg },
      { status: 500 }
    );
  }
}
