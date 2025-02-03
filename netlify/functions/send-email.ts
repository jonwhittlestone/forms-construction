import { Handler } from '@netlify/functions';

interface EmailPayload {
  email: string;
  message: string;
  to: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('Received body:', event.body); // Log raw body
    const payload = JSON.parse(event.body || '') as EmailPayload;
    console.log('Parsed payload:', payload); // Log parsed payload

    // Validate required fields
    if (!payload.email || !payload.message || !payload.to) {
      console.log('Missing fields detected');
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing required fields' }) };
    }

    // Construct email content
    const emailContent = `...`; // (unchanged)
    console.log('Constructed email content:', emailContent);

    // Correct API endpoint (changed from /messages to /emails)
    const apiUrl = `https://api.netlify.com/api/v1/sites/${process.env.SITE_ID}/emails`;
    console.log('Using API URL:', apiUrl);

    // Send email
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        from: "verified-email@yourdomain.com", // Use verified email
        to: [payload.to],
        reply_to: payload.email, // User's email as reply-to
        subject: 'New Contact Form Submission',
        text: emailContent,
      }),
    });

    // Check for API errors
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error: ${response.status} - ${errorBody}`);
      throw new Error(`Email API failed: ${errorBody}`);
    }

    console.log('Email API response:', await response.json());
    return { statusCode: 200, body: JSON.stringify({ message: 'Email sent successfully' }) };

  } catch (error) {
    console.error('Full error:', error); // Log entire error object
    return { statusCode: 500, body: JSON.stringify({ message: 'Error sending email' }) };
  }
};
