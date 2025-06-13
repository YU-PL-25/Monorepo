import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/CtaSection.css';

function CtaSection() {
  return (
    <section className="cta-section">
      <h2 className="cta-title">지금 바로 셔틀플레이를 시작해보세요</h2>
      <p className="cta-subtext">배드민턴의 새로운 경험, 셔틀플레이와 함께 하세요</p>
      <Link to="/main" className="cta-button">지금 시작하기</Link>
    </section>
  );
}

export default CtaSection;
