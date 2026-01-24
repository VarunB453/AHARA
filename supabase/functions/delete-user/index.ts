import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Deno types for better TypeScript support
declare global {
  namespace Deno {
    namespace env {
      function get(name: string): string | undefined
    }
  }
}

// Enhanced CORS configuration for Deno
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, DELETE',
  'Access-Control-Max-Age': '86400',
}

// Environment validation
const getEnvVar = (name: string): string => {
  const value = Deno.env.get(name)
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

// Initialize Supabase client with error handling
const getSupabaseClient = () => {
  try {
    return createClient(
      getEnvVar('SUPABASE_URL'),
      getEnvVar('SUPABASE_SERVICE_ROLE_KEY')
    )
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    throw error
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      )
    }

    // Get request body
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // Create Supabase admin client
    const supabaseAdmin = getSupabaseClient()

    // Verify the request is from an authenticated user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: corsHeaders }
      )
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: corsHeaders }
      )
    }

    // Users can only delete their own account (unless they're admin)
    if (user.id !== userId) {
      // Check if user is admin (you might want to add an admin role check)
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'Unauthorized: You can only delete your own account' }),
          { status: 403, headers: corsHeaders }
        )
      }
    }

    // Delete the user's authentication data
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to delete user',
          details: deleteError.message 
        }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Log the deletion for audit purposes
    console.log(`User ${userId} deleted by ${user.id} at ${new Date().toISOString()}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'User deleted successfully',
        deletedBy: user.id,
        deletedAt: new Date().toISOString()
      }),
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage 
      }),
      { status: 500, headers: corsHeaders }
    )
  }
})
