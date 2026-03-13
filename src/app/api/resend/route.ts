import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderEmailHtml } from "@/lib/renderEmailHtml";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Simple in-memory rate limiter: 5 requests per IP per 60 seconds.
// NOTE: Module-level state is not shared across serverless function instances.
// For distributed rate limiting, replace with Upstash Redis (@upstash/ratelimit).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

// ─── Sanitization ─────────────────────────────────────────────────────────────
// Strip HTML tags from any text field before rendering into the email template.
function stripHtml(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim();
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Validate server-side email config
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL;

  if (!from || !to) {
    console.error("Missing RESEND_FROM_EMAIL or RESEND_TO_EMAIL env vars");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  // Parse and sanitize body
  const body = await req.json();

  const sanitized = {
    firstName: stripHtml(body.firstName),
    lastName: stripHtml(body.lastName),
    phoneNumber: stripHtml(body.phoneNumber),
    email: stripHtml(body.email),
    position: stripHtml(body.position),
    company: stripHtml(body.company),
    message: stripHtml(body.message),
    cartItems: Array.isArray(body.cartItems)
      ? body.cartItems.map((item: Record<string, unknown>) => ({
          name: stripHtml(item.name),
          category: stripHtml(item.category),
          size: stripHtml(item.size),
          quantity: stripHtml(item.quantity),
        }))
      : [],
  };

  if (!sanitized.firstName || !sanitized.lastName || !sanitized.email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Render email HTML server-side
  const html = renderEmailHtml(sanitized);

  // Send via Resend
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: "Contact Form Submission",
      html,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
