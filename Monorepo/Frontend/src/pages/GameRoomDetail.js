import React from "react";
import "../styles/GameRoomDetail.css";
import { useParams, useNavigate } from "react-router-dom";

const GameRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ localStorage에서 selectedRoom 가져오기
  const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom") || "{}");

  // ✅ 존재하지 않는 방이면 안내
  if (!selectedRoom || !selectedRoom.id || parseInt(id) !== selectedRoom.id) {
    return (
      <div className="grd-gameroom-detail">
        <div className="grd-detail-header">
          <div className="grd-header-content">
            <button className="grd-back-button" onClick={() => navigate(-1)}>
              ←
            </button>
          </div>
        </div>

        <div className="grd-body-center">
          <main className="grd-detail-container">
            <h2>존재하지 않는 게임방입니다.</h2>
          </main>
        </div>
      </div>
    );
  }

  // ✅ 공통 변수
  const venueName = selectedRoom.venue?.name || selectedRoom.title || "-";
  const venueAddress = selectedRoom.venue?.address || selectedRoom.location || "-";
  const gameType = selectedRoom.type || selectedRoom.gameType || "";
  const players = selectedRoom.players || "-";
  const date = selectedRoom.date || "-";
  const time = selectedRoom.time || "-";
  const distance = selectedRoom.distance || "-";

  // ✅ 중복 선언 없도록 위치 여기로 정리
  const isDoubles = gameType.includes("복식");
  const isSingles = gameType.includes("단식");
  const requiredPlayers = isDoubles ? 4 : 2;
  const currentPlayers = selectedRoom?.playersInRoom?.length || 1; // 실제 데이터 구조에 맞게 수정 가능
  const isRoomReady = currentPlayers >= requiredPlayers;

  const handleGameStart = () => {
    console.log("게임 시작 버튼 클릭됨!");
  };

  return (
    <div className="grd-gameroom-detail">
      <header className="grd-detail-header">
        <div className="grd-header-content">
          <button className="grd-back-button" onClick={() => navigate(-1)}>
            ← 
          </button>
          <div className="grd-room-status-badge">
            <div className="grd-status-indicator waiting" />
            대기 중
          </div>
        </div>
      </header>

      <div className="grd-body-center">
        <main className="grd-detail-container">
          <div className="grd-main-content">
            <section className="grd-room-info-section">
              <div className="grd-room-header">
                <h2 className="grd-room-title">{venueName} 🏸</h2>
                <div className="grd-room-meta">
                  <span>거리: {distance}m</span>
                  <span>{date} {time}</span>
                  <span>인원: {players}명</span>
                  <span className="grd-game-type">{gameType}</span>
                </div>
              </div>
              <div className="grd-room-details">
                <div className="grd-detail-card court-info">
                  <h3>코트 정보</h3>
                  <p>위치: {venueAddress}</p>
                  <p>코트 번호: 3번</p>
                </div>
                <div className="grd-detail-card">
                  <h3>게임 규칙</h3>
                  <ul className="grd-rules-list">
                    <li>21점 1세트</li>
                    <li>3분 대기시간 초과 시 자동 패배</li>
                    <li>심판 없음 (자체진행)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="grd-teams-section">
              <h3 className="grd-section-title">팀 구성</h3>
              <div className={isSingles ? "grd-singles-container" : "grd-teams-container"}>
                <div className="grd-team-card">
                  <h4 className="grd-team-title">내 팀</h4>
                  <div className="grd-team-players">
                    <div className="grd-player-card">
                      <div className="grd-player-avatar">
                        <div className="grd-avatar-circle large" style={{ background: "#af1aaa" }}>주</div>
                        <div className="grd-host-badge">👑</div>
                      </div>
                      <div className="grd-player-info">
                        <p className="grd-player-name">김주영</p>
                        <p className="grd-skill-level">중급자</p>
                        <div className="grd-player-status">
                          <span className="grd-ready-indicator ready">READY</span>
                        </div>
                      </div>
                    </div>
                    {isDoubles && (
                      <div className="grd-empty-slot">
                        <div className="grd-empty-avatar large">+</div>
                        <div>팀원 모집 중</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grd-vs-divider">
                  <span className="grd-vs-text">VS</span>
                </div>

                <div className="grd-team-card">
                  <h4 className="grd-team-title">상대 팀</h4>
                  <div className="grd-team-players">
                    <div className="grd-empty-slot">
                      <div className="grd-empty-avatar large">+</div>
                      <div>상대 모집 중</div>
                    </div>
                    {isDoubles && (
                      <div className="grd-empty-slot">
                        <div className="grd-empty-avatar large">+</div>
                        <div>상대 모집 중</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="grd-actions-section">
              <div className="grd-action-buttons">
                <button className="grd-start-button" onClick={handleGameStart} disabled={!isRoomReady}>
                  게임 시작
                </button>
                <button className="grd-leave-button" onClick={() => navigate(-1)}>
                  나가기
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GameRoomDetail;
