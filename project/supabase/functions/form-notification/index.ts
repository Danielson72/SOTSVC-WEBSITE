import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
    const payload = await req.json()
    const { type, data } = payload.record

    // Prepare email content based on form type
    let emailContent
    if (type === 'quote') {
      emailContent = {
        subject: 'Your Quote Request Has Been Received - Sonz of Thunder SVC',
        html: `
          <h2>Thank You for Your Quote Request!</h2>
          <p>Dear ${data.fullName},</p>
          <p>We have received your quote request for ${data.serviceType} service. Our team will review your request and get back to you within 24 hours.</p>
          <h3>Your Request Details:</h3>
          <ul>
            <li>Service Type: ${data.serviceType}</li>
            <li>Preferred Date: ${data.preferredDate}</li>
            <li>Preferred Time: ${data.preferredTime}</li>
            <li>Address: ${data.address}</li>
          </ul>
          <p>If you need to make any changes to your request or have any questions, please don't hesitate to contact us at sonzofthunder72@gmail.com or call (407) 461-6039.</p>
          <p>Best regards,<br>Sonz of Thunder SVC Team</p>
        `
      }
    } else {
      emailContent = {
        subject: 'We\'ve Received Your Message - Sonz of Thunder SVC',
        html: `
          <h2>Thank You for Contacting Us!</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>If you need immediate assistance, please don't hesitate to call us at (407) 461-6039.</p>
          <p>Best regards,<br>Sonz of Thunder SVC Team</p>
        `
      }
    }

    // Send email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Sonz of Thunder SVC <no-reply@sotsvc.com>',
        to: data.email,
        subject: emailContent.subject,
        html: emailContent.html
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
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