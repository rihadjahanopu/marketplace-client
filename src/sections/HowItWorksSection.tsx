'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { UserPlus, Camera, Rocket, Handshake } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up for free in seconds. Verify your email and you are ready to go.',
    step: '01',
  },
  {
    icon: Camera,
    title: 'List Your Item',
    description: 'Take photos, write a description, set your price, and publish your listing.',
    step: '02',
  },
  {
    icon: Rocket,
    title: 'Get Discovered',
    description: 'Your item appears in search results and category pages for buyers to find.',
    step: '03',
  },
  {
    icon: Handshake,
    title: 'Complete the Sale',
    description: 'Connect with buyers, negotiate, and complete the transaction securely.',
    step: '04',
  },
];

export function HowItWorksSection() {
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
            How It <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Start selling in four simple steps. Our streamlined process makes it easy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12 }}
              className="relative"
            >
              <div className="bg-gray-50 rounded-2xl p-6 text-center relative overflow-hidden">
                <span className="absolute top-4 right-4 text-5xl font-bold text-gray-100 select-none">
                  {item.step}
                </span>
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center relative z-10">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 relative z-10">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed relative z-10">{item.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-300 to-secondary-300" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
