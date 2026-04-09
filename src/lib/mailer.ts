const FROM_NAME = process.env.BREVO_FROM_NAME ?? "Flinchi";
const FROM_EMAIL = process.env.BREVO_FROM_EMAIL ?? "hi@flinchi.com";
export const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const transporter = {
  sendMail: async (opts: MailOptions) => {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) throw new Error("BREVO_API_KEY is not set");

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: FROM_NAME, email: FROM_EMAIL },
        to: [{ email: opts.to }],
        subject: opts.subject,
        htmlContent: opts.html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Brevo API error ${res.status}: ${err}`);
    }

    return res.json();
  },
};
