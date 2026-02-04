// src/pages/Pay.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy } from 'lucide-react';
import QRCode from 'react-qr-code';

const MERCHANT_ADDRESS = 'TB98b4LLE8fJeSsxpmNWd979XY9FiB3KHN';
const WISH_PHONE = '81394607';

const Pay: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { t } = useTranslation();
  const location = useLocation() as { state?: { planId?: string } };

  const [paymentMethod, setPaymentMethod] = useState<'tron' | 'wish'>('tron');
  const [copied, setCopied] = useState(false);
  const [orderId] = useState(() => `order-${Date.now()}`);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [startedNotified, setStartedNotified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planId = location.state?.planId || 'course';
  const formValid = Boolean(firstName && lastName && phone && email);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const amount = useMemo(() => {
    const priceLabel = t(`pricing.${planId}.price`, { defaultValue: '$0' });
     const num = parseFloat(priceLabel.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? priceLabel : `$${(num * 0.8).toFixed(2)}`
  }, [planId, t]);

  const handleCopy = () => {
    const textToCopy = paymentMethod === 'tron' ? MERCHANT_ADDRESS : WISH_PHONE;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  const tronUri = useMemo(() => {
    if (!amount) return `tron:${MERCHANT_ADDRESS}`;
    return `tron:${MERCHANT_ADDRESS}?amount=${amount}`;
  }, [amount]);

  // Called when user clicks "I sent the payment"
  const notifyStarted = async () => {
    if (!amount || startedNotified) return;
    setError(null);
    try {
      const params = new URLSearchParams({
        orderId,
        amount: amount.toString(),
        stage: 'started',
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || '',
        paymentMethod: paymentMethod,
      });
      await fetch(`/api/check-usdt?${params.toString()}`);
      setStartedNotified(true);
    } catch (e: any) {
      console.error('Failed to notify started', e);
      setError(e?.message || 'Failed to send notification. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-xl w-full bg-black/60 border border-white/10 rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white">
          {t('pay.title', { defaultValue: 'Secure payment processing' })}
        </h1>

        <div className="space-y-2 text-sm text-gray-300">
          <div>
            <span className="font-semibold">Plan: </span>
            <span>{t(`pricing.${planId}.title`, { defaultValue: planId })}</span>
          </div>
          <div>
            <span className="font-semibold">Amount: </span>
            <span>
              {amount
                ? `${amount} ${paymentMethod === 'tron' ? 'USDT (TRC20)' : 'USD'}`
                : 'N/A'}
            </span>
          </div>
          <div>
            <span className="font-semibold">Order ID: </span>
            <span>{orderId}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            {t('pay.method.title', { defaultValue: 'Select payment method' })}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('tron')}
              className={`px-4 py-3 rounded-lg border transition-all ${
                paymentMethod === 'tron'
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-black/20 border-white/10 text-white/60 hover:bg-black/30'
              }`}
            >
              <div className="font-semibold">TRON</div>
              <div className="text-xs mt-1">USDT (TRC20)</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('wish')}
              className={`px-4 py-3 rounded-lg border transition-all ${
                paymentMethod === 'wish'
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-black/20 border-white/10 text-white/60 hover:bg-black/30'
              }`}
            >
              <div className="font-semibold">Wish</div>
              <div className="text-xs mt-1">Lebanese Payment Method</div>
            </button>
          </div>
        </div>

        {/* Payment Instructions - TRON */}
        {paymentMethod === 'tron' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">
              {t('pay.instructions.title', {
                defaultValue: 'Send USDT (TRC20) to this address',
              })}
            </h2>
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg p-3">
              <span className="font-mono text-xs text-green-300 break-all">
                {MERCHANT_ADDRESS}
              </span>

              <button
                type="button"
                onClick={handleCopy}
                className="ml-2 p-2 rounded-full bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#AA771C] hover:brightness-110 transition-all flex items-center justify-center"
                title="Copy to clipboard"
              >
                <Copy
                  className={`w-4 h-4 ${copied ? 'text-emerald-400' : 'text-[#AA771C]'}`}
                />
              </button>
            </div>

            <div className="flex justify-center pt-2">
              <QRCode value={MERCHANT_ADDRESS} size={140} />
            </div>

            <p className="text-xs text-gray-400">
              {t('pay.instructions.note', {
                defaultValue:
                  'Send exactly the amount shown above on the TRC20 network. After you send the payment, we will verify it and contact you by email.',
              })}
            </p>

            <p className="text-[11px] text-gray-500 break-all">URI: {tronUri}</p>
          </div>
        )}

        {/* Payment Instructions - Wish */}
        {paymentMethod === 'wish' && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">
              {t('pay.instructions.wish.title', {
                defaultValue: 'Send payment via Wish',
              })}
            </h2>
            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg p-3">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Send to phone number:</div>
                <span className="font-mono text-lg text-green-300">{WISH_PHONE}</span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="ml-2 p-2 rounded-full bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#AA771C] hover:brightness-110 transition-all flex items-center justify-center"
                title="Copy to clipboard"
              >
                <Copy
                  className={`w-4 h-4 ${copied ? 'text-emerald-400' : 'text-[#AA771C]'}`}
                />
              </button>
            </div>

            <div className="flex justify-center pt-2">
              <QRCode value={WISH_PHONE} size={140} />
            </div>

            <p className="text-xs text-gray-400">
              {t('pay.instructions.wish.note', {
                defaultValue:
                  'Send exactly the amount shown above via Wish to the phone number. After you send the payment, fill in your details below and click "I sent the payment".',
              })}
            </p>
          </div>
        )}

        {/* Client details + "I sent the payment" */}
        <div className="space-y-3 pt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              notifyStarted();
            }}
            className="space-y-3"
          >
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              required
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500"
            />

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              required
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500"
            />

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              required
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (for receipt / access)"
              required
              className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500"
            />
            {email && !emailValid && (
              <p className="text-xs text-red-400">Enter a valid email address</p>
            )}
            <button
              type="submit"
              disabled={!formValid || startedNotified}
              className="w-full py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {startedNotified
                ? 'Details sent – we will verify your payment'
                : 'I sent the payment'}
            </button>

            {error && <p className="text-xs text-red-400">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Pay;
