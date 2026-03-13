"use server";

// ─────────────────────────────────────────────────────────────────────────────
// sendEmail Server Action
//
// Replaces the /api/resend HTTP round-trip. Called directly from the contact
// form client component — no fetch() needed.
//
// Responsibilities:
//   • IP-based rate limiting (same policy as the route handler)
//   • Input sanitization (strip HTML before rendering into the email template)
//   • Server-side env var validation for from/to addresses
//   • Render email HTML via renderEmailHtml helper
//   • Send via Resend and return a typed result
// ─────────────────────────────────────────────────────────────────────────────

import { headers } from "next/headers";
import { Resend } from "resend";
import { renderEmailHtml } from "@/lib/renderEmailHtml";
import type { FormValues } from "@/lib/formTypes";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// NOTE: Module-level state is not shared across serverless invocations.
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
function stripHtml(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim();
}

// ─── Action ───────────────────────────────────────────────────────────────────
export async function sendEmail(
  formData: FormValues
): Promise<{ success: boolean; error?: string }> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.RESEND_TO_EMAIL;

  if (!from || !to) {
    console.error("Missing RESEND_FROM_EMAIL or RESEND_TO_EMAIL env vars");
    return { success: false, error: "Server misconfiguration" };
  }

  const sanitized = {
    firstName: stripHtml(formData.firstName),
    lastName: stripHtml(formData.lastName),
    phoneNumber: stripHtml(formData.phoneNumber),
    email: stripHtml(formData.email),
    position: stripHtml(formData.position),
    company: stripHtml(formData.company),
    message: stripHtml(formData.message),
    cartItems: Array.isArray(formData.cartItems)
      ? formData.cartItems.map((item) => ({
          name: stripHtml(item.name),
          category: stripHtml(item.category),
          size: stripHtml(item.size),
          quantity: stripHtml(item.quantity),
        }))
      : [],
  };

  if (!sanitized.firstName || !sanitized.lastName || !sanitized.email) {
    return { success: false, error: "Missing required fields" };
  }

  const html = renderEmailHtml(sanitized);

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Contact Form Submission",
    html,
  });

  if (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
