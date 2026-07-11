'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShoppingBag, Users, DollarSign, Star } from 'lucide-react';

const stats = [
  { icon: ShoppingBag, label: 'Total Listings', value: 12500, suffix: '+' },
  { icon: Users, label: 'Active Users', value: 8500, suffix: '+' },
  { icon: DollarSign, label: 'Successful Sales', value: 42000, suffix: '+' },
  { icon: Star, label: 'Avg. Rating', value: 4.8, suffix: '/5', isDecimal: true },
];

function AnimatedCounter({ value, suffix, isDecimal, inView }: { value: number; suffix: string; isDecimal?: boolean; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? Math.round(current * 10) / 10 : Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value, isDecimal]);

  return (
    <span>
      {isDecimal ? count.toFixed(1) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center card-shadow hover-lift"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} inView={inView} />
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
