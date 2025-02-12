import { Handler } from '@netlify/functions';

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
  throw new Error('MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables are required');
}

interface EmailPayload {
  email: string;
  phone?: string;
  message: string;
  to: string;
}

interface MailgunResponse {
  id: string;
  message: string;
}

export const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    console.log('Received body:', event.body);

    const { email, phone, message, to } = JSON.parse(event.body || '') as EmailPayload;
    console.log('Parsed email:', email);
    console.log('Parsed phone:', phone);
    console.log('Parsed message:', message);
    console.log('Parsed to:', to);

    // Validate required fields
    if (!email || !message || !to) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    // Construct email content
    const emailContent = `
      New message from contact form:
      
      From: ${email}
      Phone: ${phone || 'Not provided'}
      Message: ${message}
    `;
    console.log('Constructed email content:', emailContent);

    // Prepare form data for Mailgun API
    const formData = new URLSearchParams();
    formData.append('from', 'Postmaster <dev@howapped.com>');
    formData.append('to', to);
    formData.append('subject', 'New Contact Form Submission');
    formData.append('text', emailContent);

    // Send email using Mailgun API
    const response = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Mailgun API error:', errorData);
      throw new Error(`Mailgun API error: ${response.status} ${response.statusText}`);
    }

    const mailgunResponse = await response.json() as MailgunResponse;
    console.log('Mailgun API response:', mailgunResponse);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully', id: mailgunResponse.id }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }
};
