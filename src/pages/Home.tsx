import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrendingUp, Users, Shield } from 'lucide-react';
import PlanDetailsModal, { PlanDetailContent } from '../components/PlanDetailsModal';
import IntroSplash from '../components/IntroSplash';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} satisfies Variants;

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
} satisfies Variants;

const viewportConfig = { once: true, amount: 0.35 } as const;

const scrollSection = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: 'easeOut' }
  }
} satisfies Variants;

const scrollStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
} satisfies Variants;

const scrollItem = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
} satisfies Variants;

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<PlanDetailContent | null>(null);
  
  // Check sessionStorage to see if intro has been shown
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('introShown');
  });

  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
        // Mark intro as shown in this session
        sessionStorage.setItem('introShown', 'true');
      }, 6500); // matches your animation duration

      return () => clearTimeout(timer);
    }
  }, [showIntro]);


  const stats = [
    { label: t('stats.students'), value: "1,000+" },
    { label: t('stats.partners'), value: "1" },
    { label: t('stats.reviews'), value: "500+" },
    { label: t('stats.earners_4'), value: "300+" },
    { label: t('stats.earners_5'), value: "100+" },
  ];

  return (
    <div className="overflow-hidden">
      {showIntro && <IntroSplash />}
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Animated Background Grid - Standard dark background restoration */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
        </div>
        
        {/* Foreground Content - pointer-events-none container, auto content */}
        <div className="container mx-auto px-4 relative z-10 pointer-events-none">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className={`text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'} pointer-events-auto`}
            >
              <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-900/50 border border-primary/20 backdrop-blur-md mb-8 hover:bg-dark-900/80 transition-colors cursor-default shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-medium text-primary tracking-wide uppercase">Live Mentorship Open</span>
              </motion.div>
              
              <motion.h1 variants={item} className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                <Trans i18nKey="hero.title">
                  Learn Forex the <span className="text-gradient font-extrabold drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">right way</span>
                </Trans>
              </motion.h1>
              
              <motion.div variants={item} className="space-y-6 mb-10 text-lg text-slate-300 max-w-xl mx-auto lg:mx-0">
                <p>{t('hero.subtitle')}</p>
                <p>{t('hero.description')}</p>
              </motion.div>
              
              <motion.div variants={item} className={`flex flex-col sm:flex-row items-center gap-4 justify-center ${isRTL ? 'lg:justify-end' : 'lg:justify-start'}`}>
                <motion.a
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212,175,55,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  href="https://discord.gg/XJFvs69q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#AA771C] text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 group border border-[#FFD700]/50"
                >
                  {t('hero.cta_primary')}
                  <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                </motion.a>
                <a
                  href="#pricing"
                  className="w-full sm:w-auto px-8 py-4 bg-dark-800/50 hover:bg-dark-800 border border-white/10 hover:border-primary/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center backdrop-blur-sm"
                >
                  {t('hero.cta_secondary')}
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              className="relative z-10 hidden lg:block pointer-events-auto"
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                
                {/* Chartix Background Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full text-center pointer-events-none">
                  <span 
                    className="text-[10rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37]/20 to-transparent select-none tracking-tighter animate-float" 
                    style={{ animationDelay: '-1.5s', fontFamily: 'Inter, sans-serif' }}
                  >
                    CHARTIX
                  </span>
                </div>

                <img 
                  src="/images/visual1.png" 
                  alt="Hero Visual" 
                  className="w-full h-auto relative z-10 drop-shadow-2xl animate-float"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Infinite Ticker Section */}
      <motion.section
        className="py-8 bg-black/30 border-y border-white/5 overflow-hidden relative"
        variants={scrollSection}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
      >
        <div className="flex w-max animate-ticker">
          {[...stats, ...stats, ...stats].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 mx-8 md:mx-16 min-w-max">
              <span className="text-3xl md:text-4xl font-bold text-white">{stat.value}</span>
              <span className="text-sm md:text-base text-slate-400 uppercase tracking-wider font-medium">{stat.label}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50 ml-8" />
            </div>
          ))}
        </div>
      </motion.section>

      {/* About / Mentor Section */}
      <motion.section
        id="mentorship"
        className="py-32 relative"
        variants={scrollSection}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
      >
        <div className="container mx-auto px-4">
          <motion.div className="grid lg:grid-cols-2 gap-16 items-center" variants={scrollStagger}>
            <motion.div className="relative order-2 lg:order-1" variants={scrollItem}>
              <div className="relative z-10">
                 <div className="relative group">
                    <img 
                      src="/images/visual2.png" 
                      alt="Mathieu Maatouk" 
                      className="w-full h-auto object-cover object-top rounded-[2rem] shadow-2xl group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-dark-900/80 via-transparent to-transparent pointer-events-none" />
                 </div>
              </div>
              {/* Soft Glow behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/10 blur-3xl -z-10 rounded-full" />
            </motion.div>

            <motion.div className="order-1 lg:order-2" variants={scrollItem}>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                {t('about.title')}
              </h2>
              <div className="space-y-6 text-slate-300 text-lg leading-relaxed">
                <p className="text-xl text-white font-medium border-l-4 border-primary pl-4 bg-gradient-to-r from-primary/10 to-transparent py-2 rounded-r-lg">
                  {t('about.greeting')}
                </p>
                <p>{t('about.p1')}</p>
                <p>{t('about.p2')}</p>
                <p>{t('about.p3')}</p>
                <p>{t('about.p4')}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="p-6 bg-dark-800 rounded-2xl border border-white/5 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] group">
                  <div className="text-3xl font-bold text-gradient mb-1">6 Figures</div>
                  <div className="text-sm text-slate-400 group-hover:text-white transition-colors">{t('about.stats.growth')}</div>
                </div>
                <div className="p-6 bg-dark-800 rounded-2xl border border-white/5 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] group">
                  <div className="text-3xl font-bold text-gradient mb-1">3+ Years</div>
                  <div className="text-sm text-slate-400 group-hover:text-white transition-colors">{t('about.stats.exp')}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Offer Section */}
      <motion.section
        className="py-24 bg-dark-800/30 relative overflow-hidden"
        variants={scrollSection}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
      >
         {/* Glows */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('offer.title')}</h2>
            <p className="text-slate-400 text-lg">{t('offer.mission')}</p>
          </div>

          <motion.div className="grid md:grid-cols-3 gap-8" variants={scrollStagger}>
             {[
               { icon: Users, title: 'offer.features.community', desc: 'offer.p3', color: 'text-sky-400', bg: 'bg-sky-500/10' },
               { icon: TrendingUp, title: 'offer.features.signals', desc: 'offer.p2', color: 'text-primary', bg: 'bg-primary/10' },
               { icon: Shield, title: 'offer.features.guidance', desc: 'offer.p4', color: 'text-indigo-400', bg: 'bg-indigo-500/10' }
             ].map((feature, i) => (
               <motion.div
                 key={i}
                  variants={scrollItem}
                 whileHover={{ y: -10 }}
                 className="p-8 rounded-3xl bg-dark-900/80 backdrop-blur-sm border border-white/5 hover:border-primary/40 transition-all group relative overflow-hidden hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
               >
                 <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform border border-white/5`}>
                   <feature.icon className={`w-8 h-8 ${feature.color} drop-shadow-lg`} />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{t(feature.title)}</h3>
                 <p className="text-slate-400 leading-relaxed">
                   {t(feature.desc)}
                 </p>
                 {/* Shine effect */}
                 <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                 </div>
               </motion.div>
             ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonial */}
      <motion.section
        className="py-24 relative"
        variants={scrollSection}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
      >
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('testimonials.title')}</h2>
           <p className="text-slate-400 mb-12">{t('testimonials.subtitle')}</p>
           <TestimonialsCarousel />
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        id="pricing"
        className="py-24 relative bg-dark-800/30"
        variants={scrollSection}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" variants={scrollItem}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t('pricing.title')}</h2>
            <p className="text-slate-400">{t('pricing.subtitle')}</p>
          </motion.div>

          <motion.div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start" variants={scrollStagger}>
            {[
              { id: 'copy', key: 'pricing.copy', popular: false },
              { id: 'course', key: 'pricing.course', popular: true, glow: true },
              { id: 'signals', key: 'pricing.signals', popular: false }
            ].map((plan) => (
              <motion.div 
                key={plan.id} 
                variants={scrollItem}
                whileHover={{ y: -5 }}
                className={`relative p-8 rounded-3xl border flex flex-col h-full metallic-card transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary/50 z-10 scale-105 shadow-[0_0_40px_rgba(212,175,55,0.15)]' 
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-[#AA771C] to-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-primary/20">
                    Best Value
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className={`text-xl font-bold mb-4 ${plan.popular ? 'text-primary' : 'text-white'}`}>{t(`${plan.key}.title`)}</h3>
                  <div className="flex flex-wrap items-baseline gap-2 mb-2">
                    <span className="text-lg text-slate-400 line-through decoration-slate-500/50">{t(`${plan.key}.price`)}</span>
                    <span className="text-4xl font-bold text-white drop-shadow-sm">
                      {(() => {
                        const price = t(`${plan.key}.price`);
                        const num = parseFloat(price.replace(/[^0-9.]/g, ''));
                        return isNaN(num) ? price : `$${(num * 0.8).toFixed(2)}`;
                      })()}
                    </span>
                    {plan.id !== 'course' && (
                      <span className="text-lg text-slate-400 font-normal whitespace-nowrap">
                        {t(`${plan.key}.period`)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm min-h-[80px] leading-relaxed">
                    {t(`${plan.key}.desc`)}
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        const features = t(`${plan.key}.features`, { returnObjects: true }) as unknown;
                        const featureList = Array.isArray(features) ? (features as string[]) : [];
                        const detailsFromLocale = t(`${plan.key}.details`, { returnObjects: true }) as unknown;
                        const detailList = Array.isArray(detailsFromLocale) && detailsFromLocale.length > 0 ? (detailsFromLocale as string[]) : featureList;
                        
                        const rawPrice = t(`${plan.key}.price`);
                        const num = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
                        const discountedPrice = isNaN(num) ? rawPrice : `$${(num * 0.8).toFixed(2)}`;

                        setSelectedPlanDetails({
                          id: plan.id,
                          title: t(`${plan.key}.title`),
                          price: discountedPrice,
                          desc: t(`${plan.key}.desc`),
                          features: detailList as string[],
                          offer: plan.id === 'course' ? t('pricing.course.offer') : undefined,
                          referralPerk: plan.id === 'course' ? t('pricing.course.referral_perk') : undefined
                        });
                      }}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors"
                    >
                      {t('common.read_more')}
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {(t(`${plan.key}.features`, { returnObjects: true }) as string[]).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-primary' : 'text-slate-500'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/pricing"
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#AA771C] text-black shadow-lg shadow-primary/20 hover:shadow-primary/40' 
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                }`}>
                  {t('common.read_more')}
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-24 relative overflow-hidden"
        variants={scrollSection}
        initial="hidden"
        whileInView="show"
        viewport={viewportConfig}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="relative bg-gradient-to-br from-[#AA771C] via-[#D4AF37] to-[#AA771C] rounded-3xl p-12 md:p-20 overflow-hidden text-center shadow-[0_0_60px_rgba(212,175,55,0.3)]"
            variants={scrollItem}
          >
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-black/40 to-transparent" />
             
             <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">{t('cta.title')}</h2>
               <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto font-medium">{t('cta.subtitle')}</p>
               <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://discord.gg/XJFvs69q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-black text-[#D4AF37] font-bold text-lg rounded-xl shadow-2xl hover:bg-dark-900 transition-colors border border-[#D4AF37]/30"
                >
                  {t('cta.button')}
                  <ArrowRight className={isRTL ? "rotate-180" : ""} />
                </motion.a>
             </div>
          </motion.div>
        </div>
      </motion.section>
      <PlanDetailsModal
        open={Boolean(selectedPlanDetails)}
        plan={selectedPlanDetails}
        onClose={() => setSelectedPlanDetails(null)}
      />
    </div>
  );
};

export default Home;
