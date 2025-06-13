import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Main.css';
import slide1 from '../assets/mainpage_img1.png';
import slide2 from '../assets/mainpage_img2.png';
import slide3 from '../assets/mainpage_img3.png';
import { Link } from 'react-router-dom';

const slides = [slide1, slide2, slide3];

function Main() {
  const notices = [
    { id: 1, title: '6월 2일 서버 점검 공지', url: '#!' },
    { id: 2, title: '셔틀플레이 정식 오픈 이벤트 안내', url: '#!' },
    { id: 3, title: '셔틀플레이와 함께 할 제휴 모임 및 구장을 모집합니다', url: '#!' },
    { id: 4, title: '셔틀플레이 사용 방법 안내', url: '#!' },
    { id: 5, title: '자주 하는 질문 안내', url: '#!' }
  ];

  const hotPosts = [
    { id: 11, title: '라켓 추천 부탁드립니다!', url: '#!' },
    { id: 12, title: '경산 히트샷 배드민턴 센터 방문 후기', url: '#!' },
    { id: 13, title: '영남대학교 동아리 하이클리어 회원 모집', url: '#!' },
    { id: 14, title: '배드민턴을 처음 시작하려고 하는데 어떤 장비를 사야할까요?', url: '#!' },
    { id: 15, title: '경북 경산에 초보자가 가입하기 좋은 모임이 있을까요?', url: '#!' }
  ];

  const week = [
    { day: 'Mon', match: [] },
    { day: 'Tue', match: [] },
    { day: 'Wed', match: [] },
    { day: 'Thu', match: [] },
    { day: 'Fri', match: ['제4회 경산시 삼성현배'] },
    { day: 'Sat', match: ['제4회 경산시 삼성현배', '제7회 통영 한산대첩배'] },
    { day: 'Sun', match: ['제7회 통영 한산대첩배'] }
  ];

  const [currentMainSlide, setCurrentMainSlide] = useState(0);

  const handlePrevMain = () => {
    setCurrentMainSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextMain = () => {
    setCurrentMainSlide(prev => (prev + 1) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMainSlide(prev => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-wrapper">
      <Header/>

      <div className="body-center">
        <main className="main-container">
          <section className="main-slider-box">
            <button className="main-slider-button left" onClick={handlePrevMain}>
              <i className="bi bi-chevron-compact-left"></i>
            </button>

            {slides.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`slide-${idx}`}
                className="main-slider-img"
                style={{ opacity: idx === currentMainSlide ? 1 : 0 }}
              />
            ))}

            <button className="main-slider-button right" onClick={handleNextMain}>
              <i className="bi bi-chevron-compact-right"></i>
            </button>

            <div className="main-slider-dots">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  className={`main-dot ${currentMainSlide === idx ? 'active' : ''}`}
                  onClick={() => setCurrentMainSlide(idx)}
                ></span>
              ))}
            </div>
          </section>

          <section className="section-box week-box">
            <div className="section-header">
              <h3 className="section-title">이번주 대회 일정</h3>
              <a href="#!" className="more-link">더보기 ▸</a>
            </div>

            <div className="week-grid">
              {week.map(c => (
                <div key={c.day} className={`week-cell ${c.match.length ? 'active' : ''}`}>
                  <span className="week-day">{c.day}</span>
                  {c.match.map(t => <span key={t} className="week-match">{t}</span>)}
                </div>
              ))}
            </div>
          </section>

          <div className="dual-grid">
            <section className="section-box">
              <div className="section-header">
                <h3 className="section-title">공지사항</h3>
                <a href="#!" className="more-link">더보기 ▸</a>
              </div>

              <ul className="link-list">
                {notices.map(n => <li key={n.id}><a href={n.url}>{n.title}</a></li>)}
              </ul>
            </section>

            <section className="section-box">
              <div className="section-header">
                <h3 className="section-title">실시간 인기 글</h3>
                <a href="#!" className="more-link">더보기 ▸</a>
              </div>

              <ul className="link-list">
                {hotPosts.map(p => <li key={p.id}><a href={p.url}>{p.title}</a></li>)}
              </ul>
            </section>
          </div>

          <section className="section-box quick-box">
            <div className="section-header">
              <h3 className="section-title">자주 찾는 기능</h3>
            </div>

            <div className="quick-actions">
              <a href="#!" className="quick-btn">
                <i className="bi bi-pencil-square quick-icon"></i>
                <span className="quick-label">게시글 작성</span>
                <span className="quick-desc">커뮤니티에 새 글을 작성하세요</span>
              </a>

              <a href="#!" className="quick-btn">
                <i className="bi bi-calendar4-week quick-icon"></i>
                <span className="quick-label">구장 예약</span>
                <span className="quick-desc">가까운 구장을 손쉽게 예약하세요</span>
              </a>

              <a href="#!" className="quick-btn">
                <i className="bi bi-map quick-icon"></i>
                <span className="quick-label">민턴 지도</span>
                <span className="quick-desc">주변 클럽과 시설 위치를 확인하세요</span>
              </a>

              <Link to="/pre-matching" className="quick-btn pre-matching-link">
                <i className="bi bi-broadcast-pin quick-icon"></i>
                <span className="quick-label">사전 매칭</span>
                <span className="quick-desc">조건에 맞는 상대를 미리 찾아보세요</span>
              </Link>
            </div>
          </section>
        </main>
      </div>

      <Footer/>
    </div>
  );
}

export default Main;
