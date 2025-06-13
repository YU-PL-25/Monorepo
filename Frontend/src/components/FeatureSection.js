import React from 'react';
import '../styles/FeatureSection.css';

function FeatureSection() {
  return (
    <section className="feature-section">
      <div className="container feature-wrapper">
        <div className="feature-column left">
          <div className="feature-inner">
            <h2 className="feature-title">이런 고민이 있으셨나요?</h2>
            <ul className="feature-list">
              <li>배드민턴을 하고 싶지만, 주변에 같이 할 사람을 찾기 어려웠어요</li>
              <li>처음 보는 사람에게 다가가 게임을 하자고 말하기가 어려웠어요</li>
              <li>저는 즐겁게 게임을 하고 싶었는데, 다들 열심히 해서 힘들었어요</li>
              <li>용품이나 구장 등 정보를 얻고 싶은데, 흩어져 있어 찾기 힘들었어요</li>
            </ul>
          </div>
        </div>

        <div className="feature-divider"></div>

        <div className="feature-column right">
          <div className="feature-inner">
            <h2 className="feature-title highlight">셔틀플레이로 해결하세요!</h2>
            <ul className="feature-list">
              <li>근처에 있는 사용자들과 자동으로 매칭되어 운동할 수 있어요</li>
              <li>매칭 버튼만 누르면 다가갈 필요 없이 게임에 참여할 수 있어요</li>
              <li>실력과 성향을 기반으로 원하는 스타일의 게임을 할 수 있어요</li>
              <li>모임, 구장, 용품 등 필요한 정보를 한 곳에서 확인할 수 있어요</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
