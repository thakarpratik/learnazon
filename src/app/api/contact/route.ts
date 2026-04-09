export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { transporter, FROM } from "@/lib/mailer";

const schema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const { name, email, subject, message } = parsed.data;
    const toEmail = process.env.CONTACT_TO_EMAIL ?? "hi@flinchi.com";

    await transporter.sendMail({
      from: FROM,
      to: toEmail,
      subject: `[Flinchi Contact] ${subject} — from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#ff6b35;margin:0 0 16px;">New contact message</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;color:#6b7280;width:100px;"><strong>Name</strong></td><td style="padding:8px 0;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;"><strong>Email</strong></td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;"><strong>Subject</strong></td><td style="padding:8px 0;">${subject}</td></tr>
          </table>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="color:#374151;line-height:1.6;white-space:pre-wrap;">${message.replace(/</g, "&lt;")}</p>
        </div>`,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "We got your message! 👋",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#fffbf5;">
          <div style="text-align:center;margin-bottom:24px;">
            <span style="font-size:40px;">🌟</span>
            <h1 style="font-size:24px;color:#ff6b35;margin:8px 0 0;font-weight:800;">Thanks, ${name.split(" ")[0]}!</h1>
          </div>
          <div style="background:#fff;border-radius:20px;padding:28px;border:1px solid #e5e7eb;">
            <p style="color:#374151;line-height:1.6;margin:0;">
              We've received your message and will get back to you within <strong>1 business day</strong>.
            </p>
            <p style="color:#6b7280;font-size:13px;margin:16px 0 0;">
              In the meantime, follow us on Instagram <a href="https://instagram.com/getflinchi" style="color:#ff6b35;">@getflinchi</a> for tips and updates.
            </p>
          </div>
        </div>`,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}
