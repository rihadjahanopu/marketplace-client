'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Regular Seller',
    avatar: 'SJ',
    content: 'MarketPlace has completely transformed how I sell my handmade crafts. The platform is intuitive, and I have reached customers I never thought possible.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Verified Buyer',
    avatar: 'MC',
    content: 'I have purchased electronics and furniture here. The search filters make it so easy to find exactly what I need. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Top Seller',
    avatar: 'ER',
    content: 'The analytics dashboard helps me understand what buyers want. My sales have increased by 200% since I started using MarketPlace.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Car Enthusiast',
    avatar: 'DK',
    content: 'Found my dream vintage car here. The seller verification system gave me confidence to make such a big purchase online.',
    rating: 5,
  },
  {
    name: 'Lisa Thompson',
    role: 'Interior Designer',
    avatar: 'LT',
    content: 'I source unique furniture pieces for my clients here. The variety and quality of listings in the Home & Garden category is incredible.',
    rating: 4,
  },
  {
    name: 'James Wilson',
    role: 'Book Collector',
    avatar: 'JW',
    content: 'As a rare book collector, I have found editions here that I could not find anywhere else. The community is knowledgeable and friendly.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Users Say</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied buyers and sellers on our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 card-shadow hover-lift relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-gray-100" />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{testimonial.content}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
