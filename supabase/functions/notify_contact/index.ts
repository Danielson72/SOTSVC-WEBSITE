// ============================================================================
// SOTSVC Contact Form Notification Service
// ============================================================================
// Purpose: Send email notifications when new contact requests are submitted
// Trigger: Database trigger on contact_requests INSERT
// Dependencies: Resend API
// Reference: FORMS-PRD.md Section 2

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// ============================================================================
// TYPES
// ============================================================================

interface ContactRequest {
  id: string
  created_at: string
  source_site: string
  form_type: string | null
  full_name: string
  email: string
  phone: string | null
  message: string | null
}

interface ResendEmailPayload {
  from: string
  to: string[]
  subject: string
  html: string
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const OWNER_EMAIL = 'dalvarez@sotsvc.com'
const SENDER_EMAIL = 'forms@sotsvc.com'
const SENDER_NAME = 'Sonz of Thunder Services'

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

function getOwnerEmailHTML(record: ContactRequest): string {
  const firstName = record.full_name.split(' ')[0]

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New SOTSVC Lead</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">

  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">

        <!-- Main Container -->
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px 40px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">🚀 New Lead Alert</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Someone wants to work with SOTSVC!</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">

              <!-- Lead Information -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">

                <!-- Name -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Name</div>
                    <div style="font-size: 18px; color: #111827; font-weight: 600;">${record.full_name}</div>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Email</div>
                    <div style="font-size: 16px;">
                      <a href="mailto:${record.email}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${record.email}</a>
                    </div>
                  </td>
                </tr>

                <!-- Phone -->
                ${record.phone ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Phone</div>
                    <div style="font-size: 16px;">
                      <a href="tel:${record.phone}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${record.phone}</a>
                    </div>
                  </td>
                </tr>
                ` : ''}

                <!-- Message -->
                ${record.message ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Message</div>
                    <div style="font-size: 16px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${record.message}</div>
                  </td>
                </tr>
                ` : ''}

                <!-- Form Type -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Form Type</div>
                    <div style="font-size: 14px; color: #374151;">
                      <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-weight: 500; text-transform: capitalize;">${record.form_type || 'Unknown'}</span>
                    </div>
                  </td>
                </tr>

                <!-- Source -->
                <tr>
                  <td style="padding: 12px 0;">
                    <div style="font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Source</div>
                    <div style="font-size: 14px; color: #374151; font-weight: 500;">${record.source_site}</div>
                  </td>
                </tr>

              </table>

              <!-- Call to Action -->
              <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">⏰ Response Time Matters</p>
                <p style="margin: 8px 0 0 0; color: #78350f; font-size: 13px; line-height: 1.5;">Studies show responding within 5 minutes increases conversion by 400%. Call ${firstName} now!</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                Submitted on ${new Date(record.created_at).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">
                SOTSVC Contact Form System • Powered by Supabase + Resend
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
}

function getVisitorEmailHTML(record: ContactRequest): string {
  const firstName = record.full_name.split(' ')[0]

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We Received Your Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">

  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">

        <!-- Main Container -->
        <table role="presentation" style="width: 600px; max-width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #111827; font-size: 32px; font-weight: 700;">✨ Thanks, ${firstName}!</h1>
              <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 18px;">We've received your request</p>
            </td>
          </tr>

          <!-- Checkmark Icon -->
          <tr>
            <td align="center" style="padding: 0 40px 30px 40px;">
              <div style="width: 80px; height: 80px; background-color: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                <div style="font-size: 48px; line-height: 1;">✓</div>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">

              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for reaching out to <strong>Sonz of Thunder Services</strong>. We take pride in delivering exceptional cleaning services throughout Central Florida.
              </p>

              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                Daniel will personally review your request and get back to you within <strong>24 hours</strong>.
              </p>

              <!-- Contact Box -->
              <div style="margin: 30px 0; padding: 24px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0 0 12px 0; color: #1e40af; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Need immediate assistance?</p>
                <p style="margin: 0; color: #1e3a8a; font-size: 24px; font-weight: 700;">
                  <a href="tel:4074616039" style="color: #1e3a8a; text-decoration: none;">(407) 461-6039</a>
                </p>
                <p style="margin: 8px 0 0 0; color: #3730a3; font-size: 13px;">
                  Monday - Saturday: 7:00 AM - 6:00 PM EST
                </p>
              </div>

              <!-- What We Do -->
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 18px; font-weight: 600;">Our Services Include:</h3>
                <ul style="margin: 0; padding-left: 24px; color: #374151; font-size: 15px; line-height: 2;">
                  <li>Residential Cleaning (Deep Clean & Maintenance)</li>
                  <li>Commercial Cleaning (Offices, Retail, Facilities)</li>
                  <li>Post-Construction Cleanup</li>
                  <li>Move-In / Move-Out Cleaning</li>
                  <li>Specialized Sanitation Services</li>
                </ul>
              </div>

              <!-- Faith Statement -->
              <div style="margin: 30px 0; padding: 20px; background-color: #fef9e7; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #92400e; font-size: 16px; font-style: italic; line-height: 1.6;">
                  "YOU'RE CLEAN OR YOU'RE DIRTY"
                </p>
                <p style="margin: 8px 0 0 0; color: #78350f; font-size: 13px;">
                  – Our motto. Our standard. Our promise.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 12px 0; color: #111827; font-size: 16px; font-weight: 600;">Sonz of Thunder Services</p>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                Serving Central Florida with Excellence Since 2015
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 13px;">
                <a href="https://sotsvc.com" style="color: #3b82f6; text-decoration: none;">www.sotsvc.com</a> •
                <a href="tel:4074616039" style="color: #3b82f6; text-decoration: none;">(407) 461-6039</a>
              </p>
              <p style="margin: 16px 0 0 0; color: #9ca3af; font-size: 11px;">
                This email was sent because you submitted a contact form on our website.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // ========================================================================
    // 1. VALIDATE ENVIRONMENT
    // ========================================================================
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not set in environment')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // ========================================================================
    // 2. PARSE REQUEST BODY
    // ========================================================================
    const payload = await req.json()
    const record: ContactRequest = payload.record

    if (!record || !record.email || !record.full_name) {
      console.error('❌ Invalid request payload:', payload)
      return new Response(
        JSON.stringify({ error: 'Invalid contact request data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`📧 Processing contact request from: ${record.full_name} (${record.email})`)

    // ========================================================================
    // 3. SEND OWNER NOTIFICATION EMAIL
    // ========================================================================
    const ownerEmail: ResendEmailPayload = {
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: [OWNER_EMAIL],
      subject: `🚀 New SOTSVC Lead – ${record.full_name}`,
      html: getOwnerEmailHTML(record),
    }

    const ownerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(ownerEmail),
    })

    if (!ownerResponse.ok) {
      const errorText = await ownerResponse.text()
      console.error('❌ Failed to send owner email:', errorText)
      throw new Error(`Resend API error: ${errorText}`)
    }

    const ownerResult = await ownerResponse.json()
    console.log(`✅ Owner email sent: ${ownerResult.id}`)

    // ========================================================================
    // 4. SEND VISITOR AUTO-REPLY EMAIL
    // ========================================================================
    const visitorEmail: ResendEmailPayload = {
      from: `${SENDER_NAME} <noreply@sotsvc.com>`,
      to: [record.email],
      subject: 'We received your request ✨',
      html: getVisitorEmailHTML(record),
    }

    const visitorResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(visitorEmail),
    })

    if (!visitorResponse.ok) {
      const errorText = await visitorResponse.text()
      console.error('❌ Failed to send visitor email:', errorText)
      // Don't throw here - owner email already sent
    } else {
      const visitorResult = await visitorResponse.json()
      console.log(`✅ Visitor email sent: ${visitorResult.id}`)
    }

    // ========================================================================
    // 5. RETURN SUCCESS
    // ========================================================================
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Emails sent successfully',
        ownerEmailId: ownerResult.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Error in notify_contact function:', error)

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// ============================================================================
// TESTING NOTES
// ============================================================================
//
// Local Testing:
// supabase functions serve notify_contact --env-file supabase/.env.local
//
// Test Payload:
// {
//   "record": {
//     "id": "test-id",
//     "created_at": "2025-10-20T12:00:00Z",
//     "source_site": "SOTSVC.com",
//     "form_type": "embedded",
//     "full_name": "Test User",
//     "email": "test@example.com",
//     "phone": "(407) 123-4567",
//     "message": "This is a test message"
//   }
// }
//
// Expected Logs:
// 📧 Processing contact request from: Test User (test@example.com)
// ✅ Owner email sent: re_xxxxx
// ✅ Visitor email sent: re_xxxxx
//
