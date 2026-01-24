/// <reference path="./deno.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Deno types for better TypeScript support
declare global {
  namespace Deno {
    namespace env {
      function get(name: string): string | undefined
    }
  }
}

// Build CORS headers per request
const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin ?? "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
})

// Simple in-memory rate limit
const rateLimitStore = new Map<string, { timestamp: number; count: number }>()

function checkRateLimit(email: string) {
  const now = Date.now()
  const fiveMinutes = 5 * 60_000
  const oneMinute = 60_000

  const record = rateLimitStore.get(email)

  if (record) {
    const timeSinceLastRequest = now - record.timestamp

    // Reset counter if more than 5 minutes have passed
    if (timeSinceLastRequest > fiveMinutes) {
      rateLimitStore.set(email, { timestamp: now, count: 1 })
      return { allowed: true, remainingTime: 0 }
    }

    // Check if too many requests in 5 minute window
    if (record.count >= 5) {
      const remainingTime = Math.ceil((fiveMinutes - timeSinceLastRequest) / 1000)
      return {
        allowed: false,
        remainingTime,
        count: record.count,
        message: `Too many magic link requests. Please try again in ${remainingTime} seconds.`
      }
    }

    // Check if immediate retry within 1 minute
    if (timeSinceLastRequest < oneMinute) {
      const remainingTime = Math.ceil((oneMinute - timeSinceLastRequest) / 1000)
      return {
        allowed: false,
        remainingTime,
        count: record.count + 1,
        message: `Please wait ${remainingTime} seconds before requesting another magic link.`
      }
    }

    // Allow request and update count
    rateLimitStore.set(email, { timestamp: now, count: record.count + 1 })
    return { allowed: true, remainingTime: 0 }
  }

  // First request
  rateLimitStore.set(email, { timestamp: now, count: 1 })
  return { allowed: true, remainingTime: 0 }
}

// Type for request handler
interface RequestHandler {
  (req: Request): Promise<Response>
}

serve(async (req: Request) => {
  const origin = req.headers.get("origin")
  const headers = corsHeaders(origin)

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers })
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers }
    )
  }

  try {
    const body = await req.json()
    const email = body?.email

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers }
      )
    }

    const sanitizedEmail = email.trim().toLowerCase()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers }
      )
    }

    const rateLimit = checkRateLimit(sanitizedEmail)
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: rateLimit.message || "Please wait before requesting another magic link",
          remainingTime: rateLimit.remainingTime,
          rateLimit: true,
        }),
        { status: 429, headers }
      )
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // ✅ Correct way in Supabase v2
    const { data: user, error: userError } =
      await supabase.auth.admin.getUserByEmail(sanitizedEmail)

    if (userError) {
      console.error(userError)
      return new Response(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers }
      )
    }

    if (!user) {
      return new Response(
        JSON.stringify({
          userExists: false,
          message: "Email not found. Please sign up first.",
        }),
        { status: 404, headers }
      )
    }

    const redirectBase =
      origin ?? Deno.env.get("VITE_BASE_URL") ?? "https://aharafoods.netlify.app"

    console.log("Sending magic link with redirect to:", `${redirectBase}/#`);
    console.log("Origin:", origin);
    console.log("VITE_BASE_URL:", Deno.env.get("VITE_BASE_URL"));

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: sanitizedEmail,
      options: {
        emailRedirectTo: `${redirectBase}/#`,
      },
    })

    if (signInError) {
      console.error(signInError)
      return new Response(
        JSON.stringify({ error: signInError.message }),
        { status: 400, headers }
      )
    }

    return new Response(
      JSON.stringify({
        userExists: true,
        message: "Magic link sent successfully",
      }),
      { status: 200, headers }
    )
  } catch (err) {
    console.error("Unexpected error:", err)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers }
    )
  }
})
