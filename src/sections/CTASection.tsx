'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 p-8 sm:p-12 lg:p-16 text-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="relative z-10">
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
              Join thousands of successful sellers on MarketPlace. Create your free account and list your first item in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-all border border-white/30"
              >
                Explore Listings
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
