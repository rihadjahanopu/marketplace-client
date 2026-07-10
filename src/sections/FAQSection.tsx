'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'Click the "Get Started" button, fill in your name, email, and password. Verify your email address, and you are ready to start buying and selling.',
  },
  {
    question: 'Is it free to list items?',
    answer: 'Yes! Our Free plan allows you to list up to 5 items at no cost. Upgrade to Pro or Business for more listings and premium features.',
  },
  {
    question: 'How does payment work?',
    answer: 'Buyers pay securely through our platform. Funds are held safely until the item is delivered. Sellers receive payment directly to their linked bank account.',
  },
  {
    question: 'What categories can I sell in?',
    answer: 'We support Electronics, Vehicles, Real Estate, Fashion, Home & Garden, Sports, Books, Services, and more. Choose the category that best fits your item.',
  },
  {
    question: 'How do I contact a seller?',
    answer: 'Each listing has a "Contact Seller" button. You can send messages directly through our platform to ask questions or negotiate prices.',
  },
  {
    question: 'Is my personal information secure?',
    answer: 'Absolutely. We use bank-level encryption for all transactions and personal data. We never share your information with third parties without consent.',
  },
  {
    question: 'Can I edit or delete my listings?',
    answer: 'Yes, go to "Manage Items" in your account dashboard. You can edit details, change prices, update photos, or remove listings anytime.',
  },
  {
    question: 'What if I have a dispute with a buyer or seller?',
    answer: 'Our dedicated support team is available 24/7 to help resolve disputes. We also have a buyer protection program for eligible transactions.',
  },
];

export function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about using MarketPlace.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="px-5 pb-4"
                >
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
