// netlify/functions/check-usdt.ts
import type { Handler, HandlerEvent } from '@netlify/functions';

// USDT TRC20 contract and your wallet
const USDT_TRC20_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
const MERCHANT_ADDRESS = 'TB98b4LLE8fJeSsxpmNWd979XY9FiB3KHN';

// Email sender via Resend
async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || 'no-reply@yourdomain.com';

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set');
    return;
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
  }
}

const handler: Handler = async (event: HandlerEvent) => {
  try {
    const params = event.queryStringParameters || {};
    const orderId = params.orderId;
    const rawAmount = params.amount;
    const email = params.email || '';
    const stage = params.stage || 'check';

    if (!orderId || !rawAmount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing orderId or amount' }),
      };
    }

    const expectedAmount = parseFloat(rawAmount);
    if (Number.isNaN(expectedAmount)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' }),
      };
    }

    const adminEmail = 'chartix1@gmail.com';

    // 1) stage=started: only send "payment started" emails
    if (stage === 'started') {
      const subject = `New payment started: ${orderId}`;
      const html = `
        <p>A new USDT TRC20 payment has been initiated.</p>
        <ul>
          <li>Order ID: <b>${orderId}</b></li>
          <li>Amount: <b>${expectedAmount} USDT (TRC20)</b></li>
          <li>Address: de>${MERCHANT_ADDRESS}</code></li>
          ${email ? `<li>Client email: ${email}</li>` : ''}
        </ul>
      `;

      if (adminEmail) {
        await sendEmail(adminEmail, subject, html);
      }
      if (email) {
        await sendEmail(
          email,
          'We received your payment request',
          `<p>We are waiting for your payment of <b>${expectedAmount} USDT (TRC20)</b> to:</p>
           <p>de>${MERCHANT_ADDRESS}</code></p>
           <p>Order ID: <b>${orderId}</b></p>`
        );
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true, stage: 'started' }),
      };
    }

    // 2) stage=check: check blockchain for USDT TRC20 payment via TronGrid/Tron API
    const tronApiKey = process.env.TRON_API_KEY;
    if (!tronApiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing TRON_API_KEY' }),
      };
    }

    // Example TronGrid-style endpoint for TRC20 transfers by address+contract.
    // Adjust the base URL/path if your provider docs use a different one.
    const url =
      `https://api.trongrid.io/v1/contracts/${USDT_TRC20_CONTRACT}/events` +
      `?event_name=Transfer&only_to=true&to=${MERCHANT_ADDRESS}&limit=20`;

    const res = await fetch(url, {
      headers: {
        'TRON-PRO-API-KEY': tronApiKey,
      },
    });

    if (!res.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Upstream error', status: res.status }),
      };
    }

    const data = (await res.json()) as any;
    const events = data?.data || [];

    const tolerance = 0.000001;
    let matchTx: any = null;

    for (const ev of events) {
      // TronGrid TRC20 Transfer event usually has result.value or result.amount,
      // check your provider docs and adjust if needed.
      const result = ev.result || {};
      const rawValue =
        result.value ||
        result.amount ||
        '0';

      // USDT has 6 decimals on TRON
      const onChainAmount = parseFloat(rawValue) / 1_000_000;

      if (Math.abs(onChainAmount - expectedAmount) <= tolerance) {
        matchTx = ev;
        break;
      }
    }

    if (!matchTx) {
      return {
        statusCode: 200,
        body: JSON.stringify({ paid: false }),
      };
    }

    const txHash = matchTx.transaction_id || matchTx.transactionId || matchTx.txID;
    const explorerUrl = `https://tronscan.org/#/transaction/${txHash}`;

    const subjectPaid = `Payment confirmed: ${orderId}`;
    const htmlPaid = `
      <p>A USDT TRC20 payment has been confirmed.</p>
      <ul>
        <li>Order ID: <b>${orderId}</b></li>
        <li>Amount: <b>${expectedAmount} USDT (TRC20)</b></li>
        <li>Address: de>${MERCHANT_ADDRESS}</code></li>
        <li>Tx Hash: <a href="${explorerUrl}">${txHash}</a></li>
      </ul>
    `;

    if (adminEmail) {
      await sendEmail(adminEmail, subjectPaid, htmlPaid);
    }
    if (email) {
      await sendEmail(
        email,
        'Your payment is confirmed',
        `<p>Your payment of <b>${expectedAmount} USDT (TRC20)</b> has been confirmed.</p>
         <p>Order ID: <b>${orderId}</b></p>
         <p>You can now access your content.</p>
         <p>Tx: <a href="${explorerUrl}">${txHash}</a></p>`
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ paid: true, txHash }),
    };
  } catch (e: any) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error', details: e?.message }),
    };
  }
};

// CommonJS export
module.exports = { handler };
