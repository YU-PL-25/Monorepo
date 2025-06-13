import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HeroSection.css';
import logo from '../assets/shuttleplay_white_logo.png';
import image1 from '../assets/herosection_image1.png';
import image2 from '../assets/herosection_image2.png';
import image3 from '../assets/herosection_image3.png';

const images = [image1, image2, image3];

function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="container">
        <header className="hero-header">
          <img src={logo} alt="ShuttlePlay Logo" className="hero-logo"/>

          <nav className="hero-nav">
            <span onClick={() => scrollToSection('hero')}>소개</span>
            <span onClick={() => scrollToSection('cards')}>주요 기능</span>
            <span onClick={() => scrollToSection('steps')}>사용 방법</span>
            <span onClick={() => scrollToSection('faq')}>자주 묻는 질문</span>
          </nav>
        </header>

        <div className="hero-content">
          <div className="hero-text">
            <h1>배드민턴의 모든 것,<br />셔틀플레이</h1>
            <p className="hero-subtext">매칭부터 커뮤니티까지, 배드민턴을 위한 올인원 플랫폼</p>
            <Link to="/main" className="hero-button">지금 시작하기</Link>
          </div>

          <div className="hero-slider">
            <button className="slider-button left" onClick={handlePrev}>
              <i className="bi bi-chevron-compact-left"></i>
            </button>
            <img src={images[currentIndex]} alt="기능 예시" className="hero-image"/>
            <button className="slider-button right" onClick={handleNext}>
              <i className="bi bi-chevron-compact-right"></i>
            </button>

            <div className="slider-dots">
              {images.map((_, index) => (
                <span key={index} className={`dot ${currentIndex === index ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
