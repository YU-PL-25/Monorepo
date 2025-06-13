import React from 'react';
import '../styles/FeatureCards.css';

const features = [
  { title: "사전 매칭", description: "날짜와 장소, 시간 등을 입력해 함께 운동할 인원을 구할 수 있어요." },
  { title: "현장 매칭", description: "현장에서 버튼 한 번으로 자동 매칭되어 즉시 게임에 참여할 수 있어요." },
  { title: "모임 관리", description: "정기 모임을 만들고, 출석 및 회원 관리를 쉽고 편리하게 할 수 있어요." },
  { title: "커뮤니티", description: "자유 게시판, 중고 장터, 홍보, 리뷰 등 다양한 소통 공간이 마련되어 있어요." },
  { title: "대회 관리", description: "대회를 개설하고, 참가 신청부터 대진표 관리까지 한 번에 해결할 수 있어요." },
  { title: "구장 예약", description: "내 위치를 기반으로 원하는 시간대의 배드민턴 구장을 쉽게 예약할 수 있어요." }
];

function FeatureCards() {
  return (
    <section className="feature-cards">
      <h2 className="feature-cards-title">주요 기능</h2>
      <div className="feature-cards-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureCards;
