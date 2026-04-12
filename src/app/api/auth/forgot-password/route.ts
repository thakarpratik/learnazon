import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter, FROM } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.user.update({
    where: { email },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://flinchi.com";
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Reset your Flinchi password",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:16px">
        <div style="text-align:center;margin-bottom:24px">
          <h1 style="font-size:28px;font-weight:800;color:#4F46E5;margin:0">Flinchi</h1>
        </div>
        <h2 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 12px">Reset your password</h2>
        <p style="color:#6B7280;margin:0 0 24px">Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}"
          style="display:inline-block;background:#4F46E5;color:#fff;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;font-size:15px">
          Reset Password
        </a>
        <p style="color:#9CA3AF;font-size:13px;margin-top:24px">
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #F3F4F6;margin:24px 0"/>
        <p style="color:#D1D5DB;font-size:12px;text-align:center">
          © ${new Date().getFullYear()} Flinchi · <a href="${appUrl}" style="color:#D1D5DB">flinchi.com</a>
        </p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
