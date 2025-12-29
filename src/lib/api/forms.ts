// Contact and Quote form submission via n8n webhook
// n8n handles: database insert, email to owner, confirmation to customer

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface QuoteFormData {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  smsOptIn: boolean;
}

// n8n webhook URL - handles everything server-side
const N8N_WEBHOOK_URL = 'https://sonzofthunder72.app.n8n.cloud/webhook/sotsvc-contact-form'

export async function submitContactForm(data: ContactFormData) {
  console.log('=== CONTACT FORM SUBMISSION START ===')
  console.log('Posting to n8n webhook...')

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message
      })
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Webhook error:', errorText)
      throw new Error('Failed to submit form. Please try again.')
    }

    // Try to parse JSON, but don't fail if we can't (CORS might block reading body)
    try {
      const result = await response.json()
      console.log('=== SUBMISSION SUCCESS ===', result)
    } catch (jsonError) {
      console.log('Could not parse response JSON (CORS may block body), but request succeeded')
    }

    // HTTP 200 means success regardless of whether we could read the body
    return { success: true };
  } catch (error: any) {
    console.error('=== SUBMISSION ERROR ===', error)
    throw new Error(error?.message || 'Network error. Please try again.')
  }
}

export async function submitQuoteForm(data: QuoteFormData) {
  console.log('=== QUOTE FORM SUBMISSION START ===')
  console.log('Posting to n8n webhook...')

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        message: `Service: ${data.serviceType}\nAddress: ${data.address}\nPreferred Date: ${data.preferredDate}\nPreferred Time: ${data.preferredTime}\nSMS Opt-in: ${data.smsOptIn ? 'Yes' : 'No'}`,
        form_type: 'quote_request',
        service_type: data.serviceType,
        address: data.address,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        sms_opt_in: data.smsOptIn
      })
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Webhook error:', errorText)
      throw new Error('Failed to submit quote. Please try again.')
    }

    // Try to parse JSON, but don't fail if we can't (CORS might block reading body)
    try {
      const result = await response.json()
      console.log('=== QUOTE SUCCESS ===', result)
    } catch (jsonError) {
      console.log('Could not parse response JSON (CORS may block body), but request succeeded')
    }

    // HTTP 200 means success regardless of whether we could read the body
    return { success: true };
  } catch (error: any) {
    console.error('=== QUOTE ERROR ===', error)
    throw new Error(error?.message || 'Network error. Please try again.')
  }
}
