import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Michael R.",
    role: "Course Graduate",
    quote: "Mathieu's teaching style is clear and practical. No fluff, just real strategies that work. I finally understand risk management.",
    rating: 5,
    avatar: "MR"
  },
  {
    id: 2,
    name: "Sarah L.",
    role: "Forex Trader",
    quote: "I went from blowing accounts to consistent profits in 3 months. The signals are accurate and the mentorship is priceless.",
    rating: 5,
    avatar: "SL"
  },
  {
    id: 3,
    name: "David K.",
    role: "Student",
    quote: "The best investment I've made for my financial future. The community support is amazing and keeps me accountable.",
    rating: 5,
    avatar: "DK"
  },
  {
    id: 4,
    name: "Jessica T.",
    role: "Part-time Trader",
    quote: "Finally a course that doesn't promise overnight riches but teaches a real skill. Highly recommended for serious beginners.",
    rating: 5,
    avatar: "JT"
  }
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: { x: 100, opacity: 0, scale: 0.95 },
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: { zIndex: 0, x: -100, opacity: 0, scale: 0.95 }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-8">
      <div className="relative h-[450px] md:h-[400px] flex items-center justify-center perspective-1000">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={currentIndex}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 100, damping: 20 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            className="absolute w-full max-w-3xl mx-auto"
          >
            <div className="relative bg-dark-800/80 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_-10px_rgba(212,175,55,0.1)] overflow-hidden group hover:border-primary/30 transition-colors duration-500">

              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center text-center">

                <div className="mb-8 relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#AA771C] to-[#D4AF37] p-[2px] shadow-lg shadow-primary/20">
                    <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center text-2xl font-bold text-primary">
                      {testimonials[currentIndex].avatar}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-dark-900 rounded-full flex items-center justify-center border border-white/10">
                    <Quote className="w-4 h-4 text-primary fill-primary" />
                  </div>
                </div>

                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonials[currentIndex].rating
                          ? "text-primary fill-primary"
                          : "text-slate-700"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xl md:text-2xl font-light text-slate-200 italic mb-8 leading-relaxed max-w-2xl">
                  "{testimonials[currentIndex].quote}"
                </p>

                <div className="flex flex-col items-center gap-1">
                  <h4 className="text-lg font-bold text-white tracking-wide">
                    {testimonials[currentIndex].name}
                  </h4>
                  <span className="text-sm text-primary/80 font-medium uppercase tracking-wider text-xs border border-primary/20 px-3 py-1 rounded-full bg-primary/5">
                    {testimonials[currentIndex].role}
                  </span>
                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
