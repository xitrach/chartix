// src/pages/Pay.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// If you use a QR component, import it here, for example:
// import QRCode from 'react-qr-code';

const MERCHANT_ADDRESS = 'TB98b4LLE8fJeSsxpmNWd979XY9FiB3KHN'; // same as in function

type PayStatus = 'waiting' | 'checking' | 'paid' | 'error';

const Pay: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation() as { state?: { planId?: string } };

  const [orderId] = useState(() => `order-${Date.now()}`);
  const [status, setStatus] = useState<PayStatus>('waiting');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [startedNotified, setStartedNotified] = useState(false);

  const planId = location.state?.planId || 'course'; // default if none

  // PLAN PRICE: make planId "test" cost 0.02 USDT for testing
  const amount = useMemo(() => {
    if (planId === 'test') return 10; // TEST PRICE

    const priceLabel = t(`pricing.${planId}.price`, { defaultValue: '$0' });
    const num = parseFloat(String(priceLabel).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  }, [planId, t]);

  // USDT QR string (optional)
  const tronUri = useMemo(() => {
    if (!amount) return `tron:${MERCHANT_ADDRESS}`;
    return `tron:${MERCHANT_ADDRESS}?amount=${amount}`;
  }, [amount]);

  // Called when user clicks "I sent the payment"
  const notifyStarted = async () => {
    if (!amount || startedNotified) return;
    try {
      const params = new URLSearchParams({
        orderId,
        amount: amount.toString(),
        stage: 'started',
        email: email || '',
      });
      await fetch(`/api/check-usdt?${params.toString()}`);
      setStartedNotified(true);
    } catch (e) {
      console.error('Failed to notify started', e);
    }
  };

  // Poll blockchain via Netlify function
  useEffect(() => {
    if (!amount) return;

    setStatus('checking');
    setError(null);

    const interval = setInterval(async () => {
      try {
        const params = new URLSearchParams({
          orderId,
          amount: amount.toString(),
          email: email || '',
          // stage defaults to "check"
        });

        const res = await fetch(`/api/check-usdt?${params.toString()}`);
        if (!res.ok) {
          throw new Error('Network error');
        }

        const data = (await res.json()) as {
          paid?: boolean;
          txHash?: string;
          error?: string;
        };

        if (data.error) {
          setError(data.error);
        }

        if (data.paid) {
          setStatus('paid');
          setTxHash(data.txHash || null);
          clearInterval(interval);
        } else {
          setStatus('checking');
        }
      } catch (e: any) {
        setError(e?.message || 'Unknown error');
        setStatus('error');
      }
    }, 8000); // check every 8 seconds

    return () => clearInterval(interval);
  }, [orderId, amount, email]);

  const explorerUrl = txHash
    ? `https://tronscan.org/#/transaction/${txHash}`
    : undefined;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
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
            <span>{amount ? `${amount} USDT (TRC20)` : 'N/A'}</span>
          </div>
          <div>
            <span className="font-semibold">Order ID: </span>
            <span>{orderId}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            {t('pay.instructions.title', { defaultValue: 'Send USDT (TRC20) to this address' })}
          </h2>
          <div className="font-mono text-xs break-all bg-black/40 border border-white/10 rounded-lg p-3 text-green-300">
            {MERCHANT_ADDRESS}
          </div>
          <p className="text-xs text-gray-400">
            {t('pay.instructions.note', {
              defaultValue:
                'Send exactly the amount shown above on the TRC20 network. Your access will unlock automatically after payment is detected on-chain.',
            })}
          </p>

          {/* Optional QR code */}
          {/* <div className="flex justify-center pt-2">
            <QRCode value={tronUri} size={140} />
          </div> */}
          <p className="text-[11px] text-gray-500 break-all">
            URI: {tronUri}
          </p>
        </div>

        {/* Email + "I sent the payment" */}
        <div className="space-y-3 pt-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email (for receipt / access)"
            className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-sm text-white"
          />
          <button
            type="button"
            onClick={notifyStarted}
            disabled={!email || startedNotified}
            className="w-full py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {startedNotified ? 'Payment started – check your email' : 'I sent the payment'}
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-semibold text-white">
            Status:{' '}
            {status === 'waiting' && 'Waiting'}
            {status === 'checking' && 'Waiting for payment (checking blockchain...)'}
            {status === 'paid' && 'Payment received ✅'}
            {status === 'error' && 'Error while checking payment'}
          </div>
          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}
          {status === 'paid' && explorerUrl && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-400 underline"
            >
              View transaction on TRONSCAN
            </a>
          )}
        </div>

        {/* Keep your existing manual verification / referral sections below if needed */}
      </div>
    </div>
  );
};

export default Pay;
