import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/MatchHistory.css';

function MatchHistory() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [gameHistory, setGameHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      axios.get(`/api/users/${user.userId}/game-history`, {
        withCredentials: true
      })
        .then(res => {
          setGameHistory(res.data);
        })
        .catch(err => {
          console.error('경기 내역 조회 실패:', err);
        });
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const totalItems = gameHistory.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentData = gameHistory.slice(startIdx, endIdx);

  const goToPage = pageNum => {
    if (pageNum < 1 || pageNum > totalPages) return;
    setCurrentPage(pageNum);
  };

  return (
    <div className="mh-page-wrapper">
      <Header/>

      <div className="mh-page-content">
        <div className="mh-container">
          <h2 className="mh-title">경기 내역 조회</h2>
          <div className="mh-table-wrapper">
            <table className="mh-table">
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>완료 여부</th>
                  <th>상대 ID</th>
                  <th>A팀 점수</th>
                  <th>B팀 점수</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((match, index) => (
                  <tr key={match.gameId || index}>
                    <td>{match.gameDate || '날짜 없음'}</td>
                    <td>{match.completed ? '완료' : '진행 중'}</td>
                    <td>{match.opponentId}</td>
                    <td>{match.scoreTeamA}</td>
                    <td>{match.scoreTeamB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mh-pagination">
            <button className="page-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              이전
            </button>
            {Array.from({ length: totalPages }, (_, idx) => (
              <button key={idx + 1} className={`page-btn ${currentPage === idx + 1 ? 'active' : ''}`} onClick={() => goToPage(idx + 1)}>
                {idx + 1}
              </button>
            ))}
            <button className="page-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              다음
            </button>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default MatchHistory;
