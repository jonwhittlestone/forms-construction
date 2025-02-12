import { Handler } from '@netlify/functions';

interface EmailPayload {
  email: string;
  phone?: string;
  message: string;
  to: string;
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
    console.log('Received body:', event.body); // Log raw body

    const { email, phone, message, to } = JSON.parse(event.body || '') as EmailPayload;
    console.log('Parsed email:', email); // Log parsed payload
    console.log('Parsed phone:', phone); // Log parsed payload
    console.log('Parsed messae:', message); // Log parsed payload
    console.log('Parsed to:', to); // Log parsed payload

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
      
      From: Postmaster <dev@howapped.com>
      Phone: ${phone || 'Not provided'}
      Message: ${message}
    `;
    console.log('Constructed email content:', emailContent);


    // Send email using Netlify's built-in email service
    await fetch(`https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        from: email,
        to: [to],
        subject: 'New Contact Form Submission',
        text: emailContent,
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }
};
