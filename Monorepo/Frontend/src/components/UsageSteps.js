import React from 'react';
import '../styles/UsageSteps.css';

const steps = [
  {
    number: 1,
    title: "필요 정보 입력",
    desc: "날짜, 장소, 시간등 매칭에 필요한 정보를 입력해요."
  },
  {
    number: 2,
    title: "매칭 상대 찾기",
    desc: "자동, 수동 매칭을 통해 상대를 찾을 수 있어요."
  },
  {
    number: 3,
    title: "즐겁게 운동하기!",
    desc: "약속된 시간과 장소에 모여서 즐겁게 운동해요!"
  }
];

function UsageSteps() {
  return (
    <section className="usage-steps">
      <h2 className="usage-title">복잡한 절차는 NO, 3단계면 충분해요</h2>
      <div className="steps-grid">
        {steps.map((step) => (
          <div className="step-card" key={step.number}>
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UsageSteps;
