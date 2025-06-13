import React, { useState } from 'react';
import '../styles/FaqSection.css';

const faqs = [
  {
    question: "셔틀플레이는 어떤 서비스인가요?",
    answer: "셔틀플레이는 배드민턴 동호인들을 위한 올인원 플랫폼으로, 온라인을 통해 매칭, 모임 관리, 커뮤니티, 구장 예약, 대회 운영, 운동 기록까지 다양한 기능을 제공합니다.",
  },
  {
    question: "회원가입을 꼭 해야 하나요?",
    answer: "회원가입을 하지 않으면 사전 매칭, 모임 참여, 커뮤니티, 운동 기록 등 주요 기능 이용이 제한되므로 원활한 사용을 위해 간단한 가입을 권장합니다."
  },
  {
    question: "구장이나 코트 예약도 가능한가요?",
    answer: "위치 기반으로 주변 구장 정보를 제공하며, 셔틀플레이 플랫폼을 통해 제휴된 센터에 한해 직접 예약이 가능합니다. 구장 예약은 회원가입 후 이용할 수 있습니다."
  },
  {
    question: "서비스를 이용하려면 비용이 드나요?",
    answer: "셔틀플레이는 기본적인 기능은 무료로 이용 가능하며, 일부 프리미엄 기능이나 제휴된 구장 예약은 유료일 수 있습니다. 자세한 내용은 서비스 이용약관을 참고해주세요."
  },
  {
    question: "매칭은 어떻게 진행되나요?",
    answer: "매칭은 사전 매칭과 현장 매칭 두 가지 방식으로 이루어지며, 사전 매칭은 사용자가 날짜, 장소, 시간 등의 정보를 등록해 함께 운동할 사람을 미리 구하는 방식이고, 현장 매칭은 현장에서 만들어진 특정 방에 들어가 방에 있는 사람들과 연령, 성별, 급수, 성향 등을 기반으로 자동으로 매칭되어 대기열에 올라간 뒤, 순서가 되면 해당 코트에서 운동을 할 수 있는 방식입니다."
  },
  {
    question: "이용 중 문제가 생기면 어떻게 하나요?",
    answer: "웹 내 '문의하기' 메뉴를 통해 언제든지 문의할 수 있으며, 운영팀이 신속하게 확인 후 답변 드리겠습니다."
  },
  {
    question: "광고나 제휴를 맺고 싶은데 어떻게 하나요?",
    answer: "셔틀플레이와의 제휴나 광고 관련 문의는 웹 내 '문의하기' 메뉴를 통해 연락주시면, 운영팀이 자세히 안내해 드리겠습니다."
  }
];

function FAQSection() {
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(index) ? prevOpenItems.filter((i) => i !== index) : [...prevOpenItems, index]
    );
  };

  return (
    <section className="faq-section">
      <h2 className="faq-title">자주 묻는 질문</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openItems.includes(index) ? "open" : ''}`}>
            <div className="faq-question" onClick={() => toggleItem(index)}>
              <span>{faq.question}</span>
              <i className={`bi ${openItems.includes(index) ? "bi-dash" : "bi-plus"}`}></i>
            </div>
            <div className={`faq-answer ${openItems.includes(index) ? "visible" : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQSection;
