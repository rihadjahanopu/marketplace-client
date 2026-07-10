'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Laptop, Car, Home, Shirt, TreePine, Dumbbell, BookOpen, Briefcase, MoreHorizontal } from 'lucide-react';

const categories = [
  { icon: Laptop, name: 'Electronics', count: '2,400+', color: 'from-blue-500 to-cyan-500' },
  { icon: Car, name: 'Vehicles', count: '1,800+', color: 'from-red-500 to-orange-500' },
  { icon: Home, name: 'Real Estate', count: '950+', color: 'from-green-500 to-emerald-500' },
  { icon: Shirt, name: 'Fashion', count: '3,200+', color: 'from-purple-500 to-pink-500' },
  { icon: TreePine, name: 'Home & Garden', count: '1,500+', color: 'from-teal-500 to-green-500' },
  { icon: Dumbbell, name: 'Sports', count: '1,100+', color: 'from-orange-500 to-yellow-500' },
  { icon: BookOpen, name: 'Books', count: '2,800+', color: 'from-indigo-500 to-purple-500' },
  { icon: Briefcase, name: 'Services', count: '750+', color: 'from-pink-500 to-rose-500' },
  { icon: MoreHorizontal, name: 'Other', count: '500+', color: 'from-gray-500 to-slate-500' },
];

export function CategoriesSection() {
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
            Browse by <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore items across a wide range of categories. Find exactly what you are looking for.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center p-5 bg-white rounded-2xl card-shadow hover-lift text-center"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.count}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
