// src/pages/Pay.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy } from 'lucide-react';
import QRCode from 'react-qr-code';

const MERCHANT_ADDRESS = 'TB98b4LLE8fJeSsxpmNWd979XY9FiB3KHN';

const Pay: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation() as { state?: { planId?: string } };

  const [copied, setCopied] = useState(false);
  const [orderId] = useState(() => `order-${Date.now()}`);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [startedNotified, setStartedNotified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planId = location.state?.planId || 'course';
  const formValid = Boolean(firstName && lastName && phone && email);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

 const amount = useMemo(() => {
  const priceLabel = t(`pricing.${planId}.price`, { defaultValue: '$0' });
  const num = parseFloat(String(priceLabel).replace(/[^0-9.]/g, ''));
  return parseFloat((num * 0.8).toFixed(2));
}, [planId, t]);

  const planTitle = t(`pricing.${planId}.title`, { defaultValue: planId });

  const tronUri = useMemo(() => {
    if (!amount) return `tron:${MERCHANT_ADDRESS}`;
    return `tron:${MERCHANT_ADDRESS}?amount=${amount}`;
  }, [amount]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(MERCHANT_ADDRESS)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error('Failed to copy:', err));
  };

  const notifyStarted = async () => {
    if (!amount || startedNotified || !formValid || !emailValid) return;

    setError(null);
    setLoading(true);

    try {
      const params = new URLSearchParams({
        orderId,
        amount: amount.toString(),
        email,
        firstName,
        lastName,
        phone,
        plan: planTitle,
      });

      const res = await fetch(`/.netlify/functions/check-usdt?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send notification');
      }

      setStartedNotified(true);
    } catch (e: any) {
      console.error('Failed to notify:', e);
      setError(e?.message || 'Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-4 py-20">
      <div className="max-w-md mx-auto text-center space-y-6">
        <h1 className="text-2xl font-bold">
          {t('pay.title', { defaultValue: 'Secure payment processing' })}
        </h1>

        <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
          <div>Plan: {planTitle}</div>
          <div>Amount: {amount ? `${amount} USDT (TRC20)` : 'N/A'}</div>
          <div>Order ID: {orderId}</div>
        </div>

        <p className="text-gray-400">
          {t('pay.instructions.title', { defaultValue: 'Send USDT (TRC20) to this address' })}
        </p>

        <div className="flex items-center justify-center gap-2 bg-black/40 rounded-lg px-4 py-3 font-mono text-xs break-all">
          <span>{MERCHANT_ADDRESS}</span>
          <button onClick={handleCopy} className="shrink-0 hover:text-cyan-400">
            <Copy size={16} />
          </button>
        </div>
        {copied && <div className="text-green-400 text-xs">Copied!</div>}

        <div className="p-4 bg-white rounded-xl inline-block">
          <QRCode value={tronUri} size={180} />
        </div>

        <p className="text-xs text-gray-500">
          {t('pay.instructions.note', {
            defaultValue:
              'Send exactly the amount shown above on the TRC20 network. After you send the payment, we will verify it and contact you by email.',
          })}
        </p>

        <div className="text-xs text-gray-600 break-all">URI: {tronUri}</div>

        <div className="bg-white/5 rounded-xl p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              notifyStarted();
            }}
            className="space-y-3 pt-4"
          >
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              required
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (for receipt / access)"
              required
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white"
            />
            {email && !emailValid && (
              <div className="text-red-400 text-xs">Enter a valid email address</div>
            )}

            <button
              type="submit"
              disabled={!formValid || !emailValid || startedNotified || loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold disabled:opacity-40"
            >
              {loading
                ? 'Sending...'
                : startedNotified
                  ? '✓ Details sent – we will verify your payment'
                  : 'I sent the payment'}
            </button>

            {error && <div className="text-red-400 text-xs mt-2">{error}</div>}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Pay;
