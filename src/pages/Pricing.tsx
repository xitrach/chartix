import React, { useState,useEffect  } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Star } from 'lucide-react';
import PlanDetailsModal, { PlanDetailContent } from '../components/PlanDetailsModal';

const Pricing: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<PlanDetailContent | null>(null);

  const plans = [
    { id: 'copy', key: 'pricing.copy', popular: false, showPeriod: true },
    { id: 'course', key: 'pricing.course', popular: true, showPeriod: false },
    { id: 'signals', key: 'pricing.signals', popular: false, showPeriod: true }
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#050505]">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            {t('pricing.title')}
          </motion.h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((plan) => {
            const rawFeatures = t(`${plan.key}.features`, { returnObjects: true });
            const features = Array.isArray(rawFeatures) ? (rawFeatures as string[]) : [];
            const detailArray = t(`${plan.key}.details`, { returnObjects: true }) as unknown;
            const details = Array.isArray(detailArray) && detailArray.length > 0 ? (detailArray as string[]) : features;

            const openDetails = () => {
              const rawPrice = t(`${plan.key}.price`);
              const num = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
              const discountedPrice = isNaN(num) ? rawPrice : `$${(num * 0.8).toFixed(2)}`;

              setSelectedPlanDetails({
                id: plan.id,
                title: t(`${plan.key}.title`),
                price: discountedPrice,
                desc: t(`${plan.key}.desc`),
                features: details,
                offer: plan.id === 'course' ? t('pricing.course.offer') : undefined,
                referralPerk: plan.id === 'course' ? t('pricing.course.referral_perk') : undefined
              });
            };

            return (
              <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`relative p-8 rounded-3xl border metallic-card transition-all duration-300 flex flex-col h-full ${
                  plan.popular 
                    ? 'border-[#D4AF37]/50 bg-dark-900/80 shadow-[0_0_30px_rgba(212,175,55,0.15)]'
                    : 'border-white/5 bg-dark-900/40 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-[#AA771C] to-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                    Best Value
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className={`text-xl font-bold mb-4 ${plan.popular ? 'text-[#D4AF37]' : 'text-white'}`}>
                    {t(`${plan.key}.title`)}
                  </h3>
                  
                  <div className="flex flex-wrap items-baseline gap-2 mb-4">
                    <span className="text-lg text-slate-400 line-through decoration-slate-500/50">{t(`${plan.key}.price`)}</span>
                    <span className="text-4xl font-bold text-white drop-shadow-sm">
                      {(() => {
                        const price = t(`${plan.key}.price`);
                        const num = parseFloat(price.replace(/[^0-9.]/g, ''));
                        return isNaN(num) ? price : `$${(num * 0.8).toFixed(2)}`;
                      })()}
                    </span>
                    {plan.showPeriod && (
                      <span className="text-lg text-slate-400 font-normal whitespace-nowrap">
                        {t(`${plan.key}.period`)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-400 text-sm min-h-[60px] leading-relaxed">
                    {t(`${plan.key}.desc`)}
                  </p>

                  {plan.id === 'course' && (
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#AA771C]/15 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/40 text-white text-sm">
                      {t('pricing.course.offer')}
                    </div>
                  )}

                  
                </div>

                {features.length > 0 && (
                  <ul className="space-y-4 mb-8 flex-grow">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-300 text-sm">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                    <button
                    type="button"
                    onClick={openDetails}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors"
                  >
                    {t('common.read_more')}
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                  </ul>
                )}

                <button 
                   onClick={() => navigate('/pay', { state: { planId: plan.id } })}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#AA771C] text-black shadow-lg shadow-primary/20 hover:shadow-primary/40' 
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                  }`}
                >
                  {t('common.enroll_now', { defaultValue: 'Enroll Now' })}
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-50">
           {[1,2,3,4].map(i => (
             <div key={i} className="flex items-center justify-center gap-2">
               <Star className="w-5 h-5 text-[#D4AF37]" />
               <span className="text-sm text-slate-300">Verified Secure</span>
             </div>
           ))}
        </div>

        <PlanDetailsModal
          open={Boolean(selectedPlanDetails)}
          plan={selectedPlanDetails}
          onClose={() => setSelectedPlanDetails(null)}
        />
      </div>
    </div>
  );
};

export default Pricing;
