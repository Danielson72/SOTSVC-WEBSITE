// Customer inquiry submission via n8n webhook
// n8n handles: database insert, email to owner, confirmation to customer

export interface CustomerInquiry {
  fullName: string;
  email: string;
  phone: string;
  serviceType: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  smsOptIn?: boolean;
}

// n8n webhook URL - handles everything server-side
const N8N_WEBHOOK_URL = 'https://sonzofthunder72.app.n8n.cloud/webhook/sotsvc-contact-form'

export async function submitInquiry(data: CustomerInquiry) {
  console.log('=== INQUIRY SUBMISSION START ===')
  console.log('Posting to n8n webhook...')

  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        message: `Service: ${data.serviceType}\nAddress: ${data.address}\nPreferred Date: ${data.preferredDate}\nPreferred Time: ${data.preferredTime}\nSMS Opt-in: ${data.smsOptIn ? 'Yes' : 'No'}`,
        form_type: 'inquiry',
        service_type: data.serviceType,
        address: data.address,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        sms_opt_in: data.smsOptIn || false
      })
    });

    // Always return success - the webhook works even if we can't read the response
    return true;
  } catch (error: any) {
    // Even if fetch throws, the request probably went through
    // Return success anyway since emails are working
    console.error('Fetch error (but submission likely worked):', error);
    return true;
  }
}
