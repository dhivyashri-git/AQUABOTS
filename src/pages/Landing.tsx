import React from 'react';
import { Hero } from '../components/landing/Hero';
import { RoleSelector } from '../components/landing/RoleSelector';
import { SmartDrainSimulator } from '../components/landing/SmartDrainSimulator';
import { PublicSections } from '../components/landing/PublicSections';
import { TechStack } from '../components/landing/TechStack';

interface LandingProps {
  onOpenLogin: (role?: 'citizen' | 'worker' | 'admin') => void;
}

export const Landing: React.FC<LandingProps> = ({ onOpenLogin }) => {
  const scrollToExplore = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Hero Section with Chennai Skyline & Live Stats */}
      <Hero onOpenLogin={onOpenLogin} onExplore={scrollToExplore} />

      {/* 2. Choose Your Role Glassmorphism Cards */}
      <RoleSelector onSelectRole={(role) => onOpenLogin(role)} />

      {/* 3. About CityHealth, Key Features & 7-Stage Pipeline */}
      <PublicSections />

      {/* 4. Interactive Smart Drainage & Waste Lift Actuation Simulator */}
      <SmartDrainSimulator />

      {/* 5. Hardware & Software Technology Stack */}
      <TechStack />
    </div>
  );
};
