/// <reference path="./deno.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Get allowed origin from environment or default to wildcard for development
const getAllowedOrigin = () => {
  const origin = Deno.env.get('ALLOWED_ORIGIN') || '*'
  return origin
}

const corsHeaders = {
  'Access-Control-Allow-Origin': getAllowedOrigin(),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400', // 24 hours
}

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { timestamp: number; count: number }>()

function checkRateLimit(email: string): { allowed: boolean; remainingTime?: number; count?: number; message?: string } {
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000
  const oneMinute = 60 * 1000

  const record = rateLimitStore.get(email)

  if (record) {
    const timeSinceLastRequest = now - record.timestamp

    // Reset counter if more than 5 minutes have passed
    if (timeSinceLastRequest > fiveMinutes) {
      rateLimitStore.set(email, { timestamp: now, count: 1 })
      return { allowed: true }
    }

    // Check if too many requests in 5 minute window
    if (record.count >= 5) {
      const remainingTime = Math.ceil((fiveMinutes - timeSinceLastRequest) / 1000)
      return {
        allowed: false,
        remainingTime,
        count: record.count,
        message: `Too many password reset requests. Please try again in ${remainingTime} seconds.`
      }
    }

    // Check if immediate retry within 1 minute
    if (timeSinceLastRequest < oneMinute) {
      const remainingTime = Math.ceil((oneMinute - timeSinceLastRequest) / 1000)
      return {
        allowed: false,
        remainingTime,
        count: record.count + 1,
        message: `Please wait ${remainingTime} seconds before requesting another reset email.`
      }
    }

    // Allow request and update count
    rateLimitStore.set(email, { timestamp: now, count: record.count + 1 })
    return { allowed: true }
  }

  // First request
  rateLimitStore.set(email, { timestamp: now, count: 1 })
  return { allowed: true }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Sanitize email (trim whitespace and convert to lowercase)
    const sanitizedEmail = email.trim().toLowerCase()

    // Check rate limit
    const rateLimit = checkRateLimit(sanitizedEmail)
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ 
          error: rateLimit.message || 'Please wait before requesting another password reset',
          remainingTime: rateLimit.remainingTime,
          rateLimit: true 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if user exists in auth.users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({
      filter: {
        email: sanitizedEmail
      }
    })

    if (listError) {
      console.error('Error checking user:', listError)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const userExists = users && users.length > 0

    if (!userExists) {
      return new Response(
        JSON.stringify({ 
          userExists: false,
          message: 'Email not found in database' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // User exists, send password reset email
    const resetRedirect = req.headers.get('origin') ?? "https://aharafoods.netlify.app"
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
      redirectTo: `${resetRedirect}/reset-password`,
    })

    if (resetError) {
      console.error('Error sending reset email:', resetError)
      // Check if it's a rate limit error from Supabase
      const errorMessage = resetError.message || 'Failed to send reset email'
      const isRateLimit = errorMessage.includes('rate limit') || errorMessage.includes('too many requests')
      
      return new Response(
        JSON.stringify({ 
          error: isRateLimit ? 'Too many password reset requests. Please try again later.' : errorMessage 
        }),
        { 
          status: isRateLimit ? 429 : 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        userExists: true,
        message: 'Password reset email sent successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
