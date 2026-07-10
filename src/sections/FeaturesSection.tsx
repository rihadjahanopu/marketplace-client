'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Zap, Search, MessageSquare, CreditCard, Globe, BarChart3, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Every transaction is protected with industry-leading encryption and fraud detection systems.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'List items in under 60 seconds and reach potential buyers instantly with our optimized platform.',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description: 'Find exactly what you need with our powerful search engine featuring filters and recommendations.',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    description: 'Communicate directly with buyers and sellers through our built-in messaging system.',
  },
  {
    icon: CreditCard,
    title: 'Easy Payments',
    description: 'Multiple payment options with secure processing. Get paid quickly and safely.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connect with buyers and sellers from around the world. Expand your market reach.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your sales, views, and performance with detailed analytics and insights.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated support team is available around the clock to help you with any issues.',
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">MarketPlace</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We provide the tools and features you need to buy and sell with confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="group p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 card-shadow hover-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
