import { NextResponse } from "next/server";

type ContactRequest = {
  type?: "contact" | "catering";
  subject?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  details?: Record<string, string>;
};

const sanitize = (value: unknown, maxLength = 1200) =>
  String(value || "")
    .replace(/\s+\n/g, "\n")
    .trim()
    .slice(0, maxLength);

const sendEmail = async ({ subject, text, replyTo }: { subject: string; text: string; replyTo?: string }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_ALERT_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const from = process.env.ORDER_ALERT_FROM || "Bikini Burger Orders <orders@bikiniburger.shop>";

  if (!apiKey || !to) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo || undefined,
      subject,
      text
    })
  });

  return response.ok;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ContactRequest;
  const type = body.type === "catering" ? "catering" : "contact";
  const name = sanitize(body.name, 200);
  const email = sanitize(body.email, 200);
  const phone = sanitize(body.phone, 80);
  const message = sanitize(body.message, 2400);

  if (!name || (!email && !phone) || !message) {
    return NextResponse.json(
      { error: "Please include a name, contact info, and message." },
      { status: 400 }
    );
  }

  const detailRows = Object.entries(body.details || {})
    .map(([key, value]) => `${sanitize(key, 80)}: ${sanitize(value, 300)}`)
    .filter((row) => !row.endsWith(":"));
  const subject =
    sanitize(body.subject, 200) ||
    (type === "catering" ? `Catering request from ${name}` : `Website message from ${name}`);
  const text = [
    type === "catering" ? "New catering request" : "New website message",
    "",
    `Name: ${name}`,
    email ? `Email: ${email}` : "",
    phone ? `Phone: ${phone}` : "",
    ...detailRows,
    "",
    "Message:",
    message
  ]
    .filter(Boolean)
    .join("\n");

  const delivered = await sendEmail({ subject, text, replyTo: email });
  if (!delivered) {
    return NextResponse.json(
      { error: "Email alerts are not configured yet. Use the phone or email link for now." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true });
}
