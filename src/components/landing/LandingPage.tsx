import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { HowItWorksSection } from './HowItWorksSection';
import { PortalRoutingHub } from './PortalRoutingHub';
import { LandingFooter } from './LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* 1. Navbar */}
      <LandingNavbar />

      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. How It Works (4-step minimal timeline) */}
      <HowItWorksSection />

      {/* 4. Portal Access Routing Hub (Farmer, Mandi Operator, State Admin) */}
      <PortalRoutingHub />

      {/* 5. Footer */}
      <LandingFooter />

    </div>
  );
};
