import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Wallet, User, Mail, Phone, CheckCircle2, CreditCard, Copy } from 'lucide-react';

type PlanOption = {
  id: 'course' | 'copy' | 'signals';
  label: string;
  price: number;
  subtitle: string;
};

type ReferralCodeEntry = {
  code: string;
  ownerEmail: string;
  remainingUses: number;
  createdAt: string;
};

type SubmissionResult = {
  planName: string;
  base: number;
  discount: number;
  total: number;
  referralGenerated?: string;
  referralUsed?: string;
};

const REFERRAL_STORAGE_KEY = 'chartix_referral_codes';

const planOptions: PlanOption[] = [
  { id: 'course', label: 'Course', price: 399.99, subtitle: 'One-time • includes 1 month signals' },
  { id: 'copy', label: 'Copy Trades', price: 49.99, subtitle: 'Monthly subscription' },
  { id: 'signals', label: 'Signals', price: 74.99, subtitle: 'Monthly subscription' }
];

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const loadReferralCodes = (): ReferralCodeEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(REFERRAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReferralCodeEntry[]) : [];
  } catch {
    return [];
  }
};

const saveReferralCodes = (entries: ReferralCodeEntry[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(entries));
};

const generateReferralCode = () => {
  const segment = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CTX-${Date.now().toString(36).toUpperCase().slice(-4)}-${segment()}`;
};

const Pay: React.FC = () => {
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    plan: '',
    method: 'crypto', // default
    transactionRef: '' // Added to track reference input
  });
  const [referralInput, setReferralInput] = useState('');
  const [appliedReferral, setAppliedReferral] = useState<string | null>(null);
  const [referralFeedback, setReferralFeedback] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    if (location.state?.planId) {
      setFormData(prev => ({ ...prev, plan: location.state.planId }));
    }
  }, [location.state]);

  const selectedPlan = useMemo(() => planOptions.find(plan => plan.id === formData.plan as PlanOption['id']), [formData.plan]);
  const GLOBAL_OFFER_ACTIVE = true;
  
  const previewDiscount = useMemo(() => {
    if (!selectedPlan) return 0;
    // If a referral code is applied, we use that. If not, and global offer is active, we use that.
    // Usually referral codes don't stack with global offers unless specified. 
    // Let's assume the 20% offer mentioned is the SAME 20%.
    if (appliedReferral || GLOBAL_OFFER_ACTIVE) {
      return Number((selectedPlan.price * 0.2).toFixed(2));
    }
    return 0;
  }, [selectedPlan, appliedReferral]);

  const previewTotal = selectedPlan ? Math.max(0, selectedPlan.price - previewDiscount) : 0;

  const handleApplyReferral = () => {
    const formatted = referralInput.trim().toUpperCase();
    if (!formatted) {
      setReferralFeedback('Enter a referral code to apply 20% off.');
      setAppliedReferral(null);
      return;
    }

    const codes = loadReferralCodes();
    const entry = codes.find(code => code.code === formatted);

    if (!entry) {
      setReferralFeedback('Code not found. Double-check the spelling.');
      setAppliedReferral(null);
      return;
    }

    if (entry.remainingUses <= 0) {
      setReferralFeedback('This code already reached its 2-use limit.');
      setAppliedReferral(null);
      return;
    }

    setAppliedReferral(formatted);
    setReferralFeedback(`Code applied! It will have ${entry.remainingUses - 1} use(s) left after this payment.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const planInfo = selectedPlan;

    if (!planInfo) {
      setReferralFeedback('Please choose a plan to continue.');
      return;
    }

    if (!formData.transactionRef) {
        alert("Please enter the transaction reference or hash to verify your payment.");
        return;
    }

    const codes = loadReferralCodes();
    let discount = 0;
    let referralUsed: string | undefined;

    // Global offer or referral discount logic
    if (GLOBAL_OFFER_ACTIVE || appliedReferral) {
      discount = Number((planInfo.price * 0.2).toFixed(2));
    }

    if (appliedReferral) {
      const entryIndex = codes.findIndex(code => code.code === appliedReferral);
      if (entryIndex !== -1 && codes[entryIndex].remainingUses > 0) {
         // Only consume usage if specifically applying a code, though with global offer it's redundant.
         // Assuming the code might give EXTRA benefits? Or just stacks?
         // For this request, let's say the code is CONSUMED if entered, but the discount is same.
         codes[entryIndex] = {
            ...codes[entryIndex],
            remainingUses: codes[entryIndex].remainingUses - 1
         };
         referralUsed = appliedReferral;
      }
    }

    let generatedCode: string | undefined;
    if (planInfo.id === 'course') {
      generatedCode = generateReferralCode();
      codes.push({
        code: generatedCode,
        ownerEmail: formData.email || 'anonymous',
        remainingUses: 1,
        createdAt: new Date().toISOString()
      });
    }

    saveReferralCodes(codes);

    setSubmissionResult({
      planName: `${planInfo.label} (${planInfo.subtitle})`,
      base: planInfo.price,
      discount,
      total: Math.max(planInfo.price - discount, 0),
      referralGenerated: generatedCode,
      referralUsed
    });

    setReferralFeedback(discount > 0 ? 'Referral discount applied successfully!' : null);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#050505]">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Complete Your Payment
          </motion.h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Secure payment processing with manual verification
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {[
              { icon: ShieldCheck, title: "Secure Process", desc: "All payments are manually verified for your security" },
              { icon: Clock, title: "Quick Verification", desc: "Payments verified within 24-48 hours" },
              { icon: Wallet, title: "Multiple Options", desc: "Whish Money and Crypto payments accepted" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-dark-900 border border-white/5 rounded-2xl hover:border-[#D4AF37]/30 transition-colors"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Payment Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-dark-900 border border-[#D4AF37]/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.05)]"
          >
            <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-white/5">Payment Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#D4AF37]" /> Full Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D4AF37]" /> Email *
                  </label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4AF37]" /> Phone / WhatsApp (Optional)
                </label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Select Plan *
                </label>
                <select 
                  required
                  value={formData.plan}
                  onChange={e => setFormData({...formData, plan: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors appearance-none"
                >
                  <option value="" disabled>Choose your plan</option>
                  {planOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {`${option.label} - ${formatCurrency(option.price)}${option.subtitle.includes('Monthly') ? '/month' : ''}`}
                    </option>
                  ))}
                </select>
                {selectedPlan && (
                  <p className="text-xs text-slate-500">
                    {selectedPlan.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Referral / Invite Code (Optional)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={referralInput}
                    onChange={e => setReferralInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors uppercase tracking-widest"
                    placeholder="CTX-XXXX-XXXX"
                  />
                  <button
                    type="button"
                    onClick={handleApplyReferral}
                    className="px-6 py-3 rounded-xl border border-[#D4AF37]/60 text-[#D4AF37] font-semibold hover:bg-[#D4AF37]/10 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {referralFeedback && (
                  <p className="text-xs text-primary/80">{referralFeedback}</p>
                )}
              </div>

              <div className="space-y-4 pt-4">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" /> Payment Method *
                </label>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setFormData({...formData, method: 'whish'})}
                    className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${formData.method === 'whish' ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-black/50 border-white/10 hover:border-white/30'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.method === 'whish' ? 'border-[#D4AF37]' : 'border-slate-500'}`}>
                      {formData.method === 'whish' && <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full" />}
                    </div>
                    <span className="text-white font-medium">Whish Money</span>
                  </div>

                  <div 
                    onClick={() => setFormData({...formData, method: 'crypto'})}
                    className={`cursor-pointer p-4 rounded-xl border flex items-center gap-3 transition-all ${formData.method === 'crypto' ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-black/50 border-white/10 hover:border-white/30'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.method === 'crypto' ? 'border-[#D4AF37]' : 'border-slate-500'}`}>
                      {formData.method === 'crypto' && <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full" />}
                    </div>
                    <span className="text-white font-medium">Cryptocurrency</span>
                  </div>
                </div>

                {/* Dynamic Payment Details */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-black/30 rounded-xl p-6 border border-white/10 mt-4"
                >
                  {formData.method === 'whish' ? (
                    <div className="space-y-6">
                      <p className="text-sm text-slate-300">
                        Transfer exactly <span className="text-[#D4AF37] font-bold">{formatCurrency(previewTotal)}</span> to the Whish account below.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="bg-dark-800 p-4 rounded-lg border border-[#D4AF37]/20 flex items-center justify-between group">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Whish Account Number</p>
                              <code className="text-[#D4AF37] font-mono font-bold text-lg">81 394 607</code>
                            </div>
                            <button 
                              type="button"
                              onClick={() => navigator.clipboard.writeText('81394607')}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Copy Number"
                            >
                              <Copy className="w-4 h-4 text-slate-400 group-hover:text-white" />
                            </button>
                        </div>
                        <div className="bg-dark-800 p-4 rounded-lg border border-[#D4AF37]/20">
                            <p className="text-xs text-slate-500 mb-1">Account Name</p>
                            <p className="text-white font-medium">Elian Chaaya</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">Transaction Reference</label>
                        <input 
                          type="text" 
                          required
                          value={formData.transactionRef}
                          onChange={e => setFormData({...formData, transactionRef: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                          placeholder="Enter your transaction reference"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-sm text-slate-300">
                        Send exactly <span className="text-[#D4AF37] font-bold">{formatCurrency(previewTotal)}</span> (USDT TRC20).
                      </p>
                      
                      <div className="space-y-3">
                        <div className="bg-dark-800 p-4 rounded-lg border border-[#D4AF37]/20 break-all group relative">
                            <p className="text-xs text-slate-500 mb-1">Wallet Address (TRC20)</p>
                            <code className="text-[#D4AF37] font-mono font-bold text-sm md:text-base block mb-2">TB98b4LLE8fJeSsxpmNWd979XY9FiB3KHN</code>
                            <button 
                              type="button"
                              onClick={() => navigator.clipboard.writeText('TB98b4LLE8fJeSsxpmNWd979XY9FiB3KHN')}
                              className="absolute top-3 right-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Copy Address"
                            >
                              <Copy className="w-4 h-4 text-slate-400 group-hover:text-white" />
                            </button>
                        </div>
                        <div className="bg-dark-800 p-4 rounded-lg border border-[#D4AF37]/20 flex justify-between items-center">
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Amount to Send</p>
                              <p className="text-white font-bold">{formatCurrency(previewTotal)}</p>
                            </div>
                            <button 
                              type="button"
                              onClick={() => navigator.clipboard.writeText(previewTotal.toString())}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Copy Amount"
                            >
                              <Copy className="w-4 h-4 text-slate-400 group-hover:text-white" />
                            </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm text-slate-400">Transaction Hash / Reference</label>
                        <input 
                          type="text" 
                          required
                          value={formData.transactionRef}
                          onChange={e => setFormData({...formData, transactionRef: e.target.value})}
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#D4AF37] focus:outline-none transition-colors"
                          placeholder="Enter your transaction hash (TXID)"
                        />
                        <p className="text-xs text-slate-500">Paste the TXID from your wallet history here to verify payment.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {selectedPlan && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <div className="flex justify-between text-sm text-slate-300">
                    <span>Plan total</span>
                    <span>{formatCurrency(selectedPlan.price)}</span>
                  </div>
                  {appliedReferral && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Referral discount (20%)</span>
                      <span>-{formatCurrency(previewDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-white pt-1 border-t border-white/5">
                    <span>Amount due</span>
                    <span>{formatCurrency(previewTotal)}</span>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full mt-8 py-4 bg-gradient-to-r from-[#AA771C] to-[#D4AF37] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
              >
                Submit Payment
              </button>

            </form>

            {submissionResult && (
              <div className="mt-10 p-6 rounded-2xl border border-white/10 bg-black/40 space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-primary/70 mb-2">Payment Summary</p>
                  <h3 className="text-white text-xl font-semibold">{submissionResult.planName}</h3>
                </div>
                <div className="space-y-1 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Base price</span>
                    <span>{formatCurrency(submissionResult.base)}</span>
                  </div>
                  {submissionResult.discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Referral discount</span>
                      <span>-{formatCurrency(submissionResult.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span>{formatCurrency(submissionResult.total)}</span>
                  </div>
                </div>

                {submissionResult.referralGenerated && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#AA771C]/20 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/50 text-white">
                    <p className="text-sm uppercase tracking-wide text-[#F5D28A]">Share & Save (1 use max)</p>
                    <p className="mt-2 text-base">Share this code with a friend or use it yourself for 20% off any plan:</p>
                    <code className="mt-3 inline-flex px-4 py-2 bg-black/40 rounded-xl font-mono text-lg tracking-widest">
                      {submissionResult.referralGenerated}
                    </code>
                    <p className="text-xs text-slate-300 mt-2">Each code works once.</p>
                  </div>
                )}

                {submissionResult.referralUsed && !submissionResult.referralGenerated && (
                  <p className="text-sm text-slate-400">
                    Referral code {submissionResult.referralUsed} was redeemed. Remaining uses update automatically.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
