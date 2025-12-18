// Contact form submission via n8n webhook
// n8n handles: database insert, email to owner, confirmation to customer

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export interface FormResponse {
  success: boolean
  message?: string
  error?: string
}

// n8n webhook URL - handles everything server-side
const N8N_WEBHOOK_URL = 'https://sonzofthunder72.app.n8n.cloud/webhook/sotsvc-contact-form'

export async function submitContactForm(data: ContactFormData): Promise<FormResponse> {
  console.log('=== FORM SUBMISSION START ===')
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
      return {
        success: false,
        error: 'Failed to submit form. Please try again.'
      }
    }

    const result = await response.json()
    console.log('=== SUBMISSION SUCCESS ===', result)

    return {
      success: true,
      message: result.message || 'Thank you! We will be in touch soon.'
    }
  } catch (error: any) {
    console.error('=== SUBMISSION ERROR ===', error)
    return {
      success: false,
      error: error?.message || 'Network error. Please try again.'
    }
  }
}
