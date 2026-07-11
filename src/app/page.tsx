'use client';

import { HeroSection } from '@/sections/HeroSection';
import { FeaturesSection } from '@/sections/FeaturesSection';
import { CategoriesSection } from '@/sections/CategoriesSection';
import { StatsSection } from '@/sections/StatsSection';
import { HowItWorksSection } from '@/sections/HowItWorksSection';
import { TestimonialsSection } from '@/sections/TestimonialsSection';
import { PricingSection } from '@/sections/PricingSection';
import { CTASection } from '@/sections/CTASection';
import { FAQSection } from '@/sections/FAQSection';
import { NewsletterSection } from '@/sections/NewsletterSection';

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CategoriesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <NewsletterSection />
    </div>
  );
}
