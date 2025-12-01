// netlify/functions/check-usdt.ts
import type { Handler, HandlerEvent } from '@netlify/functions';

const MERCHANT_ADDRESS = 'TB98b4LLE8fJeSsxpmNWd979XY9FiB3KHN';
const ADMIN_EMAIL = 'chartix1@gmail.com';

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) {
    console.error('RESEND_API_KEY not set');
    throw new Error('Email service not configured');
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Email send failed:', text);
    throw new Error(`Email failed: ${text}`);
  }

  return res.json();
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const { orderId, amount, email, firstName, lastName, phone, plan } = params;

    if (!orderId || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing orderId or amount' }),
      };
    }

    // Email to admin
    const adminSubject = `💰 New Payment: ${orderId}`;
    const adminHtml = `
      <h2>New USDT Payment Initiated</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Order ID</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${orderId}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${amount} USDT (TRC20)</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Plan</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${plan || 'N/A'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Customer</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${firstName || ''} ${lastName || ''}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${email || 'Not provided'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${phone || 'Not provided'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Wallet</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${MERCHANT_ADDRESS}</td></tr>
      </table>
      <p style="margin-top: 20px; color: #666;">Please verify payment on <a href="https://tronscan.org/#/address/${MERCHANT_ADDRESS}">TronScan</a></p>
    `;

    await sendEmail(ADMIN_EMAIL, adminSubject, adminHtml);

    // Email to customer
    if (email) {
      const customerSubject = `Your payment request - Order ${orderId}`;
      const customerHtml = `
        <h2>Thank you for your order!</h2>
        <p>We received your payment notification. Please ensure you've sent the exact amount to our wallet.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Order ID</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${orderId}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Amount</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${amount} USDT (TRC20)</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Send to</strong></td><td style="padding: 8px; border: 1px solid #ddd; font-family: monospace; font-size: 12px;">${MERCHANT_ADDRESS}</td></tr>
        </table>
        <p style="margin-top: 20px;">Once we verify your payment on the blockchain, we'll send you access details.</p>
      `;

      await sendEmail(email, customerSubject, customerHtml);
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true, message: 'Notifications sent' }),
    };
  } catch (e: any) {
    console.error('Error:', e);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e?.message || 'Internal error' }),
    };
  }
};