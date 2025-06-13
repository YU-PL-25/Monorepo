import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/MyPage.css';
import axios from 'axios';

function MyPage() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/users/myinfo', {
          withCredentials: true,
      });
      setUserData(response.data);
      } catch (error) {
        console.error('회원정보 조회 실패:', error);
      }
    };

    fetchUserInfo();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  return (
    <div className="mypage-page-wrapper">
      <Header/>

      <div className="mypage-page-content">
        <div className="mypage-container">
          <h2 className="mypage-title">내 정보</h2>

          <div className="mypage-info">
            <div className="info-row">
              <span className="info-label">이름</span>
              <span className="info-value">{userData?.name || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">이메일</span>
              <span className="info-value">{userData?.email || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">전화번호</span>
              <span className="info-value">{userData?.phone || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">닉네임</span>
              <span className="info-value">{userData?.nickname || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">성별</span>
              <span className="info-value">{userData?.gender || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">급수</span>
              <span className="info-value">{userData?.rank || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">연령대</span>
              {/* <span className="info-value">{userData?.profile?.ageGroup || '미등록'}</span> */}
              <span className="info-value">{userData?.ageGroup || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">플레이 스타일</span>
              <span className="info-value">{userData?.playStyle || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">게임 타입</span>
              <span className="info-value">{userData?.gameType || '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">MMR</span>
              <span className="info-value">{userData?.rating ?? '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">게임 횟수</span>
              <span className="info-value">{userData?.gamesPlayed ?? '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">승리 횟수</span>
              <span className="info-value">{userData?.winsCount ?? '미등록'}</span>
            </div>

            <div className="info-row">
              <span className="info-label">승률</span>
              <span className="info-value">
                {userData?.winRate !== undefined ? `${Math.round(userData.winRate * 100)}%` : '미등록'}
              </span>
            </div>
          </div>

          <div className="mypage-actions">
            <button className="action-btn">게임 스타일 수정</button>
            <button className="action-btn">개인 정보 수정</button>
            <button className="action-btn">비밀번호 변경</button>
            <button className="action-btn">작성 내역 조회</button>
            <Link to="/mypage/match-history" className="action-btn match-history-link">
              경기 내역 조회
            </Link>
            <button className="action-btn">참가중인 매칭 조회</button>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default MyPage;
