import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.language === 'ar';

  // Predefined responses logic
  const getBotResponse = (query: string, lang: string) => {
    const q = query.toLowerCase();
    const isAr = lang === 'ar';

    if (isAr) {
      if (q.includes('سعر') || q.includes('تكلفة') || q.includes('اشتراك') || q.includes('بكام')) {
        return "نقدم 3 خطط رئيسية:\n1. الدورة الكاملة: $499.99 (مرة واحدة)\n2. نسخ الصفقات: $62.49/شهرياً\n3. الإشارات فقط: $93.74/شهرياً\n\nيمكنك الدفع عبر العملات الرقمية أو البطاقات البنكية.";
      }
      if (q.includes('مرحبا') || q.includes('السلام') || q.includes('اهلا')) return "مرحباً بك في Chartix Mentorship! 👋\nأنا مساعدك الذكي هنا.\nيمكنني إجابتك عن:\n- تفاصيل الدورة والأسعار\n- كيفية الانضمام للديسكورد\n- طرق الدفع\n\nكيف يمكنني مساعدتك؟";
      if (q.includes('ديسكورد') || q.includes('مجتمع')) return "مجتمع الديسكورد هو قلب الأكاديمية! 🚀\nنشارك فيه:\n- صفقات لايف يومياً\n- تحليلات للسوق\n- مجتمع داعم من المتداولين\n\nاضغط على زر 'انضم إلى ديسكورد' في القائمة للدخول.";
      if (q.includes('مبتدئ') || q.includes('جديد') || q.includes('صفر')) return "لا تقلق أبداً! 🎓\nبرنامجنا مصمم ليأخذك من الصفر تماماً.\nسنعلمك:\n- أساسيات الفوركس\n- إدارة المخاطر\n- استراتيجيات التداول\n- النفسية الصحيحة للتداول";
      if (q.includes('ربح') || q.includes('دخل') || q.includes('فلوس')) return "العديد من طلابنا يبدأون في تحقيق أرباح في الشهر الأول، لكن تذكر أن التداول يتطلب صبراً وتعلماً مستمراً.\nنحن هنا لنسرع رحلتك ونقلل من أخطائك.";
      if (q.includes('دفع') || q.includes('طريقة')) return "نقبل الدفع عبر البطاقات الائتمانية (Visa/Mastercard) والعملات الرقمية (USDT).\nتواصل معنا عبر الديسكورد إذا واجهت أي مشكلة.";
      return "عذراً، لم أفهم سؤالك تماماً. 🤔\nيمكنك سؤالي عن الأسعار، الدورة، أو الديسكورد.\nأو يمكنك الانضمام لمجتمعنا للتحدث مع فريق الدعم مباشرة.";
    } else {
      if (q.includes('price') || q.includes('cost') || q.includes('subscription') || q.includes('much')) {
        return "We offer 3 main plans:\n1. Full Course: $499.99 (One-time payment)\n2. Copy Trading: $62.49/month\n3. Signals Only: $93.74/month\n\nAll plans give you access to our community!";
      }
      if (q.includes('hello') || q.includes('hi') || q.includes('hey')) return "Welcome to Chartix Mentorship! 👋\nI'm your AI assistant.\nI can help you with:\n- Course details & Pricing\n- Joining Discord\n- Payment methods\n\nWhat would you like to know?";
      if (q.includes('discord') || q.includes('community')) return "Our Discord is where the magic happens! 🚀\nWe share:\n- Live daily signals\n- Market analysis\n- A supportive community\n\nClick the 'Join Discord' button in the menu to get started.";
      if (q.includes('beginner') || q.includes('start') || q.includes('new')) return "Perfect place to start! 🎓\nOur program is designed to take you from zero to hero.\nWe cover:\n- Forex basics\n- Risk management\n- Proven strategies\n- Trading psychology";
      if (q.includes('profit') || q.includes('earn') || q.includes('money')) return "Many students start seeing results in their first month! However, trading requires patience and discipline.\nWe are here to fast-track your success and help you avoid common mistakes.";
      if (q.includes('pay') || q.includes('method')) return "We accept Credit Cards (Visa/Mastercard) and Crypto (USDT).\nIf you need help, just open a ticket in our Discord.";
      return "I'm not sure I understood that. 🤔\nYou can ask me about prices, the course, or Discord.\nOr join our community to chat with real support!";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botResponse = getBotResponse(input, i18n.language);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isUser: false
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  // Initial greeting updates when language changes
  useEffect(() => {
    if (isOpen) { // Only update if chat is open to avoid spamming if closed
      const greeting = i18n.language === 'ar'
        ? "مرحباً! 👋 أنا مساعد Chartix الذكي. اسألني عن الأسعار، الدورة، أو الديسكورد!"
        : "Hello! 👋 I'm Chartix AI. Ask me about prices, the course, or Discord!";
        
      // Add a system message indicating language switch if messages exist, or replace init if empty
      setMessages(prev => {
        if (prev.length === 0) return [{ id: 'init', text: greeting, isUser: false }];
        // Optional: You could add a small "Language changed" system note here if desired
        return prev;
      });
    }
  }, [i18n.language, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-primary/10 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="font-bold text-white text-sm">Chartix AI Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[300px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
                      msg.isUser
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white/10 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5 bg-dark-800">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isRTL ? "اكتب رسالتك..." : "Type your message..."}
                  className={`w-full bg-dark-900 border border-white/10 rounded-full py-2.5 px-4 text-sm text-white focus:outline-none focus:border-primary/50 ${isRTL ? 'pl-10' : 'pr-10'}`}
                />
                <button
                  onClick={handleSend}
                  className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-2' : 'right-2'} p-1.5 bg-primary rounded-full text-white hover:bg-primary-hover transition-colors`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-hover transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
