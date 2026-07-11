'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import {
  Target,
  Heart,
  Shield,
  Users,
  Globe,
  Award,
} from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To create the most trusted and user-friendly marketplace platform that empowers individuals and businesses to buy and sell with complete confidence.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'We believe in transparency, security, and community. Every feature we build is designed to foster trust and create meaningful connections between buyers and sellers.',
  },
  {
    icon: Shield,
    title: 'Your Security',
    description: 'We employ bank-level encryption and advanced fraud detection to ensure every transaction is safe. Your data and privacy are our top priorities.',
  },
];

const team = [
  { name: 'Alex Rivera', role: 'CEO & Founder', initials: 'AR' },
  { name: 'Sarah Chen', role: 'Head of Product', initials: 'SC' },
  { name: 'Marcus Johnson', role: 'Lead Engineer', initials: 'MJ' },
  { name: 'Emily Davis', role: 'Head of Design', initials: 'ED' },
];

const stats = [
  { icon: Users, value: '50K+', label: 'Active Users' },
  { icon: Globe, value: '120+', label: 'Countries' },
  { icon: Award, value: '99.9%', label: 'Uptime' },
];

export default function AboutPage() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">About MarketPlace</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Building the future of commerce, one transaction at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section ref={ref} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-2xl p-8 card-shadow hover-lift text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <stat.icon className="w-10 h-10 text-primary-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Passionate individuals dedicated to building the best marketplace experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center card-shadow hover-lift"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{member.initials}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              MarketPlace was founded in 2020 with a simple mission: to make buying and selling online as easy and secure as possible. 
              What started as a small project has grown into a global platform serving thousands of users across 120+ countries.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We have built a community where trust matters. Every seller is verified, every transaction is protected, 
              and every user is supported by our dedicated team around the clock.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, MarketPlace processes thousands of transactions monthly, offering everything from electronics and vehicles 
              to real estate and services. We are just getting started, and the future looks brighter than ever.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
