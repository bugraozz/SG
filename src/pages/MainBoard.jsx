import React from 'react';
import HeroSection from './sections/HeroSection';
import HeroCardsSection from './sections/HeroCardsSection';
import FeatureCards from './sections/FeatureCards';
import BrandMarquee from './sections/BrandMarquee';
import AboutMe from './sections/AboutMe';
import WhySection from './sections/WhySection';
import TextReveal from './sections/TextReveal';
import TransformBanner from './sections/TransformBanner';
import SkewedBanner from './sections/SkewedBanner';
import WhatYouGet from './sections/WhatYouGet';
import Transformations from './sections/Transformations';
import PricingSection from './sections/PricingSection';
import FAQSection from './sections/FAQSection';
import FooterSection from './sections/FooterSection';
import './MainBoard.css';

const MainBoard = () => {
  return (
    <div className="main-board">
      <HeroSection />
      <FeatureCards />
      <BrandMarquee />
      <AboutMe />
      <WhySection />
      <TextReveal />
      <SkewedBanner />
      <WhatYouGet />
      <Transformations />
      <PricingSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
};

export default MainBoard;
