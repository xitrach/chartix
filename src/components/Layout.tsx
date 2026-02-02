import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Chatbot from './Chatbot';

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t('common.menu.home'), path: '/' },
    { name: t('common.menu.mentorship'), path: '/#mentorship' },
    { name: t('common.menu.pricing'), path: '/#pricing' },
    //{ name: t('common.menu.pay'), path: '#pay' },
    { name: t('common.menu.discord'), path: 'https://discord.gg/XJFvs69q', external: true },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30 selection:text-white">
      {/* Navbar */}
      <nav
        className={clsx(
          'fixed top-0 w-full z-50 transition-all duration-500',
          isScrolled 
            ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]' 
            : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/images/logo.jpg" alt="Chartix Logo" className="w-10 h-10 rounded-full border-2 border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
            <span className="text-2xl font-bold tracking-tight text-white">
              Chartix<span className="text-primary drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                target={link.external ? "_blank" : "_self"}
                rel={link.external ? "noopener noreferrer" : ""}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group overflow-hidden"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#AA771C] to-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-sm text-slate-300 hover:text-white"
            >
              <Globe className="w-4 h-4" />
              <span>{i18n.language.toUpperCase()}</span>
            </button>
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,175,55,0.4)" }}
              whileTap={{ scale: 0.95 }}
              href="https://discord.gg/XJFvs69q"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-gradient-to-r from-[#AA771C] via-[#D4AF37] to-[#AA771C] text-black text-sm font-bold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all border border-[#FFD700]/30"
            >
              {t('common.join_discord')}
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 z-40 bg-dark-900/95 backdrop-blur-xl pt-24 px-4 md:hidden"
          >
            <div className="flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold text-white hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <button onClick={toggleLang} className="text-lg text-slate-400 mt-8 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Chatbot />

      {/* Footer */}
      <footer className="bg-dark-900 border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src="/images/logo.jpg" alt="Chartix Logo" className="w-8 h-8 rounded-full grayscale opacity-80" />
                <span className="text-2xl font-bold text-white">Chartix Mentorship</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                {t('hero.subtitle')}
              </p>
              <div className="flex gap-4">
                 {/* Socials placeholders */}
                 {[1,2,3].map(i => (
                   <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                     <Globe className="w-5 h-5" />
                   </div>
                 ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6">{t('common.footer.quick_links')}</h4>
              <ul className="space-y-4">
                {['Home', 'Mentorship', 'Pricing', 'Join Discord'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">
                      {t(`common.menu.${item.toLowerCase().replace(' ', '_')}`, item)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6">{t('common.footer.contact')}</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>chartix1@gmail.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+961 81 394 607</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-xs">
              {t('common.footer.rights')}
            </p>
            <div className="flex gap-6 text-xs text-slate-600">
              <a href="#" className="hover:text-slate-400">{t('common.footer.terms')}</a>
              <a href="#" className="hover:text-slate-400">{t('common.footer.privacy')}</a>
              <a href="#" className="hover:text-slate-400">{t('common.footer.risk')}</a>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
            <p className="text-red-400/80 text-xs text-center max-w-4xl mx-auto">
              {t('common.risk_warning')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
