import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

export interface PlanDetailContent {
  id: string;
  title: string;
  price: string;
  desc: string;
  features: string[];
  offer?: string;
  referralPerk?: string;
}

interface PlanDetailsModalProps {
  open: boolean;
  plan?: PlanDetailContent | null;
  onClose: () => void;
}

const PlanDetailsModal: React.FC<PlanDetailsModalProps> = ({ open, plan, onClose }) => {
  return (
    <AnimatePresence>
      {open && plan && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-3xl bg-dark-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 overflow-y-auto max-h-[90vh] space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary/80 mb-3">Plan Overview</p>
                <h3 className="text-3xl font-bold text-white mb-3">{plan.title}</h3>
                <p className="text-4xl font-extrabold text-primary mb-2">{plan.price}</p>
                <p className="text-slate-300 text-base leading-relaxed">{plan.desc}</p>
              </div>

              {plan.offer && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#AA771C]/20 via-[#D4AF37]/10 to-transparent border border-[#D4AF37]/40 text-white shadow-lg">
                  <div className="text-sm font-semibold uppercase tracking-wide text-[#F5D28A] mb-1">Limited Offer</div>
                  <p className="text-base font-medium">{plan.offer}</p>
                </div>
              )}

              <div>
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-primary inline-block" />
                  What's Included
                </h4>
                <ul className="space-y-3 text-slate-200">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-3">
                      <ArrowRight className="w-4 h-4 text-primary mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.referralPerk && (
                <div className="p-4 rounded-2xl bg-black/40 border border-primary/30 text-slate-100">
                  <p className="text-sm uppercase tracking-wide text-primary mb-1">Referral Bonus</p>
                  <p className="text-base leading-relaxed">{plan.referralPerk}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-primary text-black font-semibold hover:bg-[#F5D28A] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanDetailsModal;
