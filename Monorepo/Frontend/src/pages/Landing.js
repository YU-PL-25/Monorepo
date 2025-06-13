import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import FeatureCards from '../components/FeatureCards';
import UsageSteps from '../components/UsageSteps';
import FaqSection from '../components/FaqSection';
import CtaSection from '../components/CtaSection';
import ScrollToTopButton from '../components/ScrollToTopButton';

function Landing() {
  return (
    <div className="landing-wrapper">
      <div id="hero"><HeroSection/></div>
      <div id="features"><FeatureSection/></div>
      <div id="cards"><FeatureCards/></div>
      <div id="steps"><UsageSteps/></div>
      <div id="faq"><FaqSection/></div>
      <div id="cta"><CtaSection/></div>
      <ScrollToTopButton/>
    </div>
  );
}

export default Landing;
