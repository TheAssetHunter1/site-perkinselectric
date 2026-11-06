/**
 * Contact form handler — Cloudflare Pages Function at POST /api/contact.
 * Replaces the old Supabase edge function. Emails the shop through Resend.
 *
 * Settings (Cloudflare dashboard → this Pages project → Settings → Variables and Secrets):
 *   RESEND_API_KEY  (secret, required)  your Resend API key
 *   CONTACT_TO      (optional)          where submissions go. Default: info@advancomputer.com
 *   CONTACT_FROM    (optional)          sender. Must be on a domain verified in Resend,
 *                                       e.g. "Advanced Computer Repair <website@advancomputer.com>".
 *                                       Until it's set, only the shop notification is sent
 *                                       (from Resend's test sender) and customers get no confirmation.
 */

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const BUSINESS = "Advanced Computer Repair";
const PHONE = "(830) 257-0036";
const DEFAULT_TO = "info@advancomputer.com";
const TEST_FROM = `${BUSINESS} <onboarding@resend.dev>`;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

async function sendEmail(env: Env, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
  const reply = (status: number, body: Record<string, unknown>) =>
    wantsJson || status !== 200
      ? Response.json(body, { status })
      : Response.redirect(new URL("/thanks", request.url).toString(), 303);

  let raw: Record<string, unknown> = {};
  try {
    const type = request.headers.get("Content-Type") || "";
    raw = type.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return reply(400, { error: "Couldn't read the form." });
  }

  // Bots fill in the hidden "company" field. Pretend it worked and drop it.
  if (clean(raw.company, 200)) return reply(200, { success: true });

  const form = {
    firstName: clean(raw.firstName, 100),
    lastName: clean(raw.lastName, 100),
    email: clean(raw.email, 200),
    phone: clean(raw.phone, 50),
    service: clean(raw.service, 200),
    message: clean(raw.message, 5000),
  };

  if (!form.firstName || !form.lastName || !form.service || form.message.length < 10)
    return reply(400, { error: "Please fill in every required field." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return reply(400, { error: "Please enter a valid email address." });
  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return reply(500, { error: "The form isn't set up yet." });
  }

  const name = `${form.firstName} ${form.lastName}`;
  const e = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, esc(v)])) as typeof form;
  const when = new Date().toLocaleString("en-US", { timeZone: "America/Chicago" });

  try {
    await sendEmail(env, {
      from: env.CONTACT_FROM || TEST_FROM,
      to: [env.CONTACT_TO || DEFAULT_TO],
      reply_to: form.email,
      subject: `New website inquiry: ${form.service} (${name})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <h1 style="color:#0866da;font-size:20px;margin:0 0 16px">New contact form submission</h1>
          <p><strong>Name:</strong> ${esc(name)}<br>
          <strong>Email:</strong> <a href="mailto:${e.email}">${e.email}</a><br>
          ${form.phone ? `<strong>Phone:</strong> <a href="tel:${e.phone}">${e.phone}</a><br>` : ""}
          <strong>Service:</strong> ${e.service}</p>
          <p style="white-space:pre-wrap;background:#f5f7fa;padding:16px;border-radius:6px">${e.message}</p>
          <p style="color:#888;font-size:12px">Submitted ${when} (Central). Hit Reply to answer the customer.</p>
        </div>`,
    });
  } catch (err) {
    console.error("Shop notification failed:", err);
    return reply(502, { error: "We couldn't send your message." });
  }

  // Customer confirmation only works from a verified sender domain.
  if (env.CONTACT_FROM) {
    try {
      await sendEmail(env, {
        from: env.CONTACT_FROM,
        to: [form.email],
        reply_to: env.CONTACT_TO || DEFAULT_TO,
        subject: `Thanks for contacting ${BUSINESS}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
            <h1 style="color:#0866da;font-size:20px;margin:0 0 16px">Thanks, ${e.firstName}!</h1>
            <p>We received your message about <strong>${e.service}</strong> and will get back to you within 24 hours.</p>
            <p>Need us sooner? Call <a href="tel:${PHONE.replace(/\D/g, "")}">${PHONE}</a>.</p>
            <p style="white-space:pre-wrap;color:#555;background:#f5f7fa;padding:16px;border-radius:6px">${e.message}</p>
            <p style="color:#888;font-size:12px">${BUSINESS} · 1216-B Sidney Baker South, Kerrville, TX 78028</p>
          </div>`,
      });
    } catch (err) {
      // The shop already has the message; don't fail the customer over the receipt.
      console.error("Customer confirmation failed:", err);
    }
  }

  return reply(200, { success: true });
};
