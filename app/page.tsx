import React from 'react';
import FloatingNav from '@/components/landing/FloatingNav';
import HeroSection from '@/components/landing/HeroSection';
import ScenarioScroll from '@/components/landing/ScenarioScroll';
import AppPreviewMockup from '@/components/landing/AppPreviewMockup';
import DiaryTestimonials from '@/components/landing/DiaryTestimonials';
import FaqAccordion from '@/components/landing/FaqAccordion';
import WaitlistSection from '@/components/landing/WaitlistSection';
import Footer from '@/components/Footer';
import VisitorTrialModal from '@/components/landing/VisitorTrialModal';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-softly-bg text-softly-text overflow-hidden">
      {/* 3-Day Free Trial Visitor Popup */}
      <VisitorTrialModal />

      {/* Floating Pill Nav */}
      <FloatingNav />

      {/* Main Single-Column Vertical Flow */}
      <main>
        {/* 1. Hero Section with 72px Outfit + cursive emphasis */}
        <HeroSection />

        {/* 2. Horizontal Scenario Scroll Cards */}
        <ScenarioScroll />

        {/* 3. 3-Phone Cascading Preview with Pulsing Coral Button */}
        <AppPreviewMockup />

        {/* 4. Diary Entry Testimonials with ±1° rotation & Reenie Beanie signature */}
        <DiaryTestimonials />

        {/* 5. Interactive FAQ Accordion */}
        <FaqAccordion />

        {/* 6. Waitlist Conversion Section */}
        <WaitlistSection />
      </main>

      {/* Comprehensive Compliance Footer */}
      <Footer />
    </div>
  );
}
