// Follow these steps to deploy this Edge Function:
// 1. Install Supabase CLI
// 2. Run: supabase functions deploy quote-webhook
// 3. Set the webhook URL in Supabase Dashboard

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/21348455/2k50hfb/'

serve(async (req) => {
  try {
    const payload = await req.json()

    // Forward to Zapier webhook
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.statusText}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})