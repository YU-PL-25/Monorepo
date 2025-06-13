import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CurrentMatchingGameRoom.css';
import { MapPin, Clock, Users, X } from "lucide-react";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const rankColor = {
  SS: "purple",
  S: "red",
  A: "orange",
  B: "yellow",
  C: "green",
  D: "blue",
  E: "gray"
};

const gameTypeLabel = { 
  Singles: "단식", 
  Doubles: "복식" 
};

// 뱃지 공통 컴포넌트
const Badge = ({ children, color = "gray" }) => (
  <span className={`cm-badge cm-badge-${color}`}>{children}</span>
);

// 버튼 공통 컴포넌트
const Button = ({ children, className = "", ...props }) => (
  <button className={`cm-btn ${className}`} {...props}>{children}</button>
);

// 단식/복식 선택 모달 (자동 매칭 등록만)
const SelectTypeModal = ({ open, onClose, onSelect }) => {
  if (!open) return null;
  return (
    <div className="cm-modal-bg">
      <div className="cm-modal-content" style={{maxWidth:330}}>
        <div className="cm-modal-header">
          <b>게임 유형 선택</b>
          <Button className="cm-modal-close" onClick={onClose}><X size={18} /></Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26, marginBottom: 18 }}>
          <Button className="cm-modal-singles" onClick={() => { onSelect('Singles'); }}>단식</Button>
          <Button className="cm-modal-doubles" onClick={() => { onSelect('Doubles'); }}>복식</Button>
        </div>
      </div>
    </div>
  );
};

// 게임 점수 입력 모달
const GameResultModal = ({ visible, onClose, room, onResultSaved, submitGameResult }) => {
  const [myScore, setMyScore] = useState('');
  const [opponentScore, setOpponentScore] = useState('');
  const [saving, setSaving] = useState(false);

  const myTeam = room?.players?.filter(p => p.team === "TEAM_A") || [];
  const opponentTeam = room?.players?.filter(p => p.team === "TEAM_B") || [];

  if (!visible || !room) return null;

  const userId = myTeam[0]?.id;
  const opponentId = opponentTeam[0]?.id;

  const handleSubmit = async () => {
    if (myScore === "" || opponentScore === "") {
      alert("양팀 점수를 모두 입력하세요.");
      return;
    }
    if (!userId || !opponentId) {
      alert("팀 대표자를 찾을 수 없습니다.");
      return;
    }
    setSaving(true);
    try {
      await submitGameResult({
        gameId: room.gameId,
        userId,
        opponentId,
        scoreTeamA: Number(myScore),
        scoreTeamB: Number(opponentScore)
      });
      if (onResultSaved) onResultSaved();
      onClose();
    } catch (e) {
      // 이미 alert 처리됨
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cm-modal-bg">
      <div className="cm-modal-content">
        <div className="cm-modal-header">
          <span role="img" aria-label="search" style={{fontSize:18}}>🔍</span>
          <b style={{marginLeft: 7}}>경기 결과 입력</b>
          <Button className="cm-modal-close" onClick={onClose}><X size={18} /></Button>
        </div>
        <div className="cm-modal-detail">
          <div>{room.courtName} / {gameTypeLabel[room.gameType]}</div>
          <div>{room.createdAt.toLocaleDateString()} {room.createdAt.toLocaleTimeString()}</div>
        </div>
        <div className="cm-modal-teams">
          <div className="cm-modal-team">
            <h4>A 팀</h4>
            {myTeam.map(user => (
              <div key={user.id} className="cm-modal-player-row">
                <span className="cm-avatar">{user.name.split(" ").map(n => n[0]).join("")}</span>
                <span>{user.name}</span>
                <Badge color={rankColor[user.rankLevel]}>
                  {user.rankLevel}
                </Badge>
              </div>
            ))}
            <div className="cm-modal-score-input">
              점수: <input
                type="number"
                value={myScore}
                min={0}
                onChange={e => setMyScore(e.target.value)}
                style={{width: 55, marginLeft: 4}}
                disabled={saving}
              />
            </div>
          </div>
          <div className="cm-modal-team">
            <h4>B 팀</h4>
            {opponentTeam.map(user => (
              <div key={user.id} className="cm-modal-player-row">
                <span className="cm-avatar">{user.name.split(" ").map(n => n[0]).join("")}</span>
                <span>{user.name}</span>
                <Badge color={rankColor[user.rankLevel]}>
                  {user.rankLevel}
                </Badge>
              </div>
            ))}
            <div className="cm-modal-score-input">
              점수: <input
                type="number"
                value={opponentScore}
                min={0}
                onChange={e => setOpponentScore(e.target.value)}
                style={{width: 55, marginLeft: 4}}
                disabled={saving}
              />
            </div>
          </div>
        </div>
        <div className="cm-modal-footer">
          <Button
            className="cm-finish-btn"
            onClick={handleSubmit}
            disabled={saving}
          >{saving ? "저장 중..." : "결과 저장"}</Button>
          <Button
            className="cm-close-btn"
            onClick={onClose}
            style={{marginLeft:10, background:"#ececec", color:"#222"}}
            disabled={saving}
          >닫기</Button>
        </div>
      </div>
    </div>
  );
};

// 팀 설정 모달
const TeamSettingModal = ({ visible, onClose, players, onSetTeams, gameId }) => {
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // 초기화: 모든 플레이어를 팀A로
    if (visible && players) {
      setTeamA(players.map(p => p.id));
      setTeamB([]);
    }
  }, [visible, players]);

  const handleTogglePlayer = (id) => {
    if (teamA.includes(id)) {
      setTeamA(teamA.filter(pid => pid !== id));
      setTeamB([...teamB, id]);
    } else {
      setTeamB(teamB.filter(pid => pid !== id));
      setTeamA([...teamA, id]);
    }
  };

  const handleAssignTeams = async () => {
    if (teamA.length === 0 || teamB.length === 0) {
      alert("A팀과 B팀에 모두 최소 1명 이상 있어야 합니다.");
      return;
    }
    setSaving(true);
    try {
      const teamAssignments = [
        ...teamA.map(userId => ({ userId: Number(userId), team: "TEAM_A" })),
        ...teamB.map(userId => ({ userId: Number(userId), team: "TEAM_B" })),
      ];
      await axios.patch(
        `/api/game/${gameId}/team`,
        teamAssignments,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      alert("팀 배정이 완료되었습니다.");
      if (onSetTeams) onSetTeams(teamA, teamB);
      onClose();
    } catch (e) {
      if (e.response && e.response.data && typeof e.response.data === "string") {
        alert(e.response.data);
      } else {
        alert("팀 배정 중 오류가 발생했습니다.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="cm-modal-bg">
      <div className="cm-modal-content">
        <div className="cm-modal-header">
          <b>팀 설정</b>
          <Button className="cm-modal-close" onClick={onClose}><X size={18} /></Button>
        </div>
        <div className="cm-team-modal-row" style={{ margin: '24px 0' }}>
          <div className="cm-team-modal-col">
            <h4>A 팀</h4>
            {players.filter(p => teamA.includes(p.id)).map(user => (
              <div key={user.id} className="cm-modal-player-row" style={{ cursor: 'pointer' }} onClick={() => handleTogglePlayer(user.id)}>
                <span className="cm-avatar">{user.name.split(" ").map(n => n[0]).join("")}</span>
                <span>{user.name}</span>
                <Badge color={rankColor[user.rankLevel]}>{user.rankLevel}</Badge>
              </div>
            ))}
          </div>
          <div className="cm-team-modal-col">
            <h4>B 팀</h4>
            {players.filter(p => teamB.includes(p.id)).map(user => (
              <div key={user.id} className="cm-modal-player-row" style={{ cursor: 'pointer' }} onClick={() => handleTogglePlayer(user.id)}>
                <span className="cm-avatar">{user.name.split(" ").map(n => n[0]).join("")}</span>
                <span>{user.name}</span>
                <Badge color={rankColor[user.rankLevel]}>{user.rankLevel}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="cm-modal-footer">
          <Button
            className="cm-finish-btn"
            onClick={handleAssignTeams}
            disabled={saving}
          >{saving ? "저장 중..." : "팀 확정"}</Button>
          <Button
            className="cm-close-btn"
            onClick={onClose}
            style={{ marginLeft: 10, background: "#ececec", color: "#222" }}
            disabled={saving}
          >취소</Button>
        </div>
      </div>
    </div>
  );
};

// 본문
export default function CurrentMatchingGameRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [headerTitle, setHeaderTitle] = useState('');
  const [courtName, setCourtName]   = useState('');
  const [courtAddr, setCourtAddr]   = useState(''); 
  const [games, setGames] = useState([]);
  const [manualWaitlist, setManualWaitlist] = useState([]);
  const [autoWaitlist, setAutoWaitlist] = useState([]);
  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRoom, setModalRoom] = useState(null);
  const [modalTypeOpen, setModalTypeOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamModalRoomId, setTeamModalRoomId] = useState(null);
  const { userId: currentUserId } = JSON.parse(localStorage.getItem('user') || '{}');
  const [isAdmin, setIsAdmin] = useState(false);

  // 수동 매칭 대기자 목록 조회
  const fetchManualWaitlist = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/match/manual/queue-users?roomId=${roomId}`, 
        { 
          headers: { 'Content-Type': 'application/json' }, 
          withCredentials: true
        }
      );
      const queued = res.data?.queuedUsers || [];
      const formatted = queued.map(user => ({
        id: user.userId,
        name: user.nickname,
        rankLevel: user.rank,
        type: 'manual'
      }));
      setManualWaitlist(formatted);
    } catch (err) {
      console.error('수동 대기자 목록 조회 실패', err);
    }
  }, [roomId]);

  // 자동 매칭 대기자 목록 조회
  const fetchAutoWaitlist = useCallback(async () => {
    try {
      const res = await axios.get(
        `/api/match/auto/queue-users?roomId=${roomId}`,
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );
      const queued = res.data?.queuedUsers || [];
      const formatted = queued.map(user => ({
        id: user.userId,
        name: user.nickname,
        rankLevel: user.rank,
        gameType: Number(user.requiredMatchCount) === 2 ? 'Singles' : 'Doubles',
        type: 'auto'
      }));
      setAutoWaitlist(formatted);
    } catch (err) {
      console.error('자동 대기자 목록 조회 실패', err);
    }
  }, [roomId]);

  // 매칭된 게임 목록 조회
    const fetchGamelist = useCallback(async () => {
    try {
      const res = await axios.get(`/api/game-room/${roomId}/game-list`, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      const room = res.data.data;

      setHeaderTitle(room.title || '');
      setCourtName(room.locationName || '');
      setCourtAddr(room.locationAddress || '');
      setIsAdmin(Number(room.managerId) === Number(currentUserId));

      const parsedGames = (room.games || []).map(game => ({
        gameId: game.gameId,
        courtName: room.locationName,
        gameType: game.players.length === 2 ? 'Singles' : 'Doubles',
        players: game.players.map(player => ({
          id: player.userId,
          name: player.nickname,
          rankLevel: player.rank,
          team: player.team || null,
          type: 'unknown'
        })),
        maxPlayers: game.players.length,
        status: game.status === "WAITING"
          ? "대기중"
          : game.status === "ONGOING"
          ? "진행중"
          : game.status === "FINISHED"
          ? "종료됨"
          : "알수없음",
        createdBy: "자동매칭",
        createdAt: new Date(`${game.date}T${game.time}`),
        isMine: Number(room.managerId) === Number(currentUserId)
      }));

      setGames(parsedGames);
    } catch (error) {
      console.error('게임 목록 조회 실패', error);
      setGames([]);
    }
  }, [roomId, currentUserId]);

  // 현재 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 게임방 정보 조회
  useEffect(() => {
    if (!roomId) return;

    fetchManualWaitlist();
    fetchAutoWaitlist();
    fetchGamelist();
  }, [roomId, currentUserId, fetchManualWaitlist, fetchAutoWaitlist, fetchGamelist]);

  // 수동 매칭 대기열 등록
  const handleManualRegister = async () => {
    try {
      await axios.post(
        `/api/match/manual/queue/gym?userId=${currentUserId}&roomId=${roomId}`,
        {},
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      alert('수동 매칭 큐에 등록되었습니다.');
      await fetchManualWaitlist();
    } catch (error) {
      console.error('수동 등록 또는 대기자 목록 조회 실패', error);
      alert('수동 등록 또는 목록 갱신 중 오류가 발생했습니다.');
    }
  };
  
  const handleAutoRegister = () => setModalTypeOpen(true);

  // 수동 매칭 대기열 등록 취소
  const handleCancelManualRegister = async () => {
    try {
      await axios.delete(
        `/api/match/manual/queue?userId=${currentUserId}`,
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      alert('수동 매칭 등록이 취소되었습니다.');
      await fetchManualWaitlist();
    } catch (error) {
      console.error('수동 매칭 등록 취소 실패', error);
      alert('수동 매칭 등록 취소 중 오류가 발생했습니다.');
    }
  };

  // 수동 매칭 생성
  const handleManualMatchCreate = async () => {
    if (selected.length !== 2 && selected.length !== 4) {
      alert("2명 또는 4명을 선택해야 매칭이 가능합니다.");
      return;
    }

    try {
      await axios.post(
        `/api/match/manual/games/${roomId}?requesterId=${currentUserId}`,
        { userIds: selected },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      alert("수동 매칭이 성공적으로 완료되었습니다.");
      setSelected([]);
      await fetchManualWaitlist(); 
      await fetchGamelist();    
    } catch (error) {
      console.error("수동 매칭 실패", error);
      alert("수동 매칭 중 오류가 발생했습니다.");
    }
  };

  // 수동 매칭 선택 취소
  const handleManualMatchCancel = () => setSelected([]);

  // 자동 매칭 대기열 등록
  const handleAddWaitlistByType = async (gameType) => {
    const requiredMatchCount = gameType === 'Singles' ? 2 : 4;

    try {
      await axios.post(
        `/api/match/auto/queue/gym?userId=${currentUserId}&roomId=${roomId}`,
        { requiredMatchCount },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      alert(`${gameType === "Singles" ? "단식" : "복식"}으로 자동 매칭 큐에 등록되었습니다.`);
      setModalTypeOpen(false);
      fetchAutoWaitlist();
    } catch (error) {
      console.error('자동 매칭 등록 실패', error);
      alert('자동 매칭 등록 중 오류가 발생했습니다.');
    }
  };

  // 자동 매칭 대기열 등록 취소
  const handleCancelAutoRegister = async () => {
    try {
      await axios.delete(
        `/api/match/auto/queue?userId=${currentUserId}`, 
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
    );
      alert('자동 매칭 등록이 취소되었습니다.');
      fetchAutoWaitlist();
    } catch (error) {
      console.error('자동 매칭 등록 취소 실패', error);
      alert('자동 매칭 등록 취소 중 오류가 발생했습니다.');
    }
  };

  // 자동 매칭 생성
  const handleStartAutoMatch = async () => {
    try {
      const response = await axios.post(
        `/api/match/auto/games/${roomId}`,
        {},
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const { userIds, gameId, date, time } = response.data;

      const matchedPlayers = autoWaitlist.filter(p =>
        userIds.includes(p.id) || userIds.includes(Number(p.id))
      );

      const gameType = userIds.length === 2 ? 'Singles' : 'Doubles';

      const newGame = {
        id: gameId,
        courtName,
        gameType,
        players: matchedPlayers,
        maxPlayers: userIds.length,
        status: 'Ready',
        createdBy: '자동매칭',
        createdAt: new Date(`${date}T${time}`),
        isMine: false
      };

      setGames(prev => [...prev, newGame]);
      setAutoWaitlist(prev => prev.filter(p => !userIds.includes(p.id)));
      alert('자동 매칭이 완료되었습니다.');
    } catch (error) {
      console.error('자동 매칭 요청 실패', error);
      alert('자동 매칭 중 오류가 발생했습니다.');
    }
  };

  // 게임 시작
  const handleStartGame = async (gameId) => {
    try {
      const res = await axios.patch(
        `/api/game/${gameId}/start`,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      alert(res.data.message || "게임이 시작되었습니다.");
      await fetchGamelist(); // 상태 갱신
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        alert(e.response.data.error);
      } else {
        alert("게임 시작 중 오류가 발생했습니다.");
      }
    }
  };

  // 게임 종료
  const handleGameComplete = async (gameId) => {
    try {
      const res = await axios.patch(
        `/api/game/${gameId}/complete`,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      alert(res.data.message || "게임이 종료되었습니다.");
      await fetchGamelist();
      await fetchManualWaitlist();
      await fetchAutoWaitlist();
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        alert(e.response.data.error);
      } else {
        alert("게임 종료 처리 중 오류가 발생했습니다.");
      }
    }
  };

  // 점수 입력
  async function submitGameResult({ gameId, userId, opponentId, scoreTeamA, scoreTeamB }) {
    try {
      const res = await axios.post(
        '/api/game/result',
        {
          gameId,
          userId,
          opponentId,
          scoreTeamA,
          scoreTeamB,
          completed: true
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      alert(res.data || "경기 결과가 정상 반영되었습니다.");
    } catch (e) {
      if (e.response && e.response.data) {
        alert(e.response.data);
      } else {
        alert("경기 결과 입력 중 오류가 발생했습니다.");
      }
      throw e;
    }
  }

  return (
    <div className="cm-current-matching-wrapper">
      <Header />
      <div className="cm-body-center">
        <div className="cm-current-matching-content">
          <div className="cm-court-matching-wrap">
            {/* 상단 정보 카드 */}
            <div className="cm-info-card">
              <div className="cm-info-row">
                <div>
                  <div className="cm-main-title">{headerTitle}</div>
                </div>
                <div className="cm-clock-box">
                  <Clock style={{ width: 18, height: 18, marginRight: 4 }} />
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              <div className="cm-sub-row">
                <MapPin style={{ width: 16, height: 16, marginRight: 4 }} />
                <span className="cm-court-name">{courtName}</span>
                <Badge color="cm-black">매칭 가능</Badge>
              </div>
              <div className="cm-sub-address">{courtAddr}</div>
              <div className="cm-checkbox-row">
                <input
                  type="checkbox"
                  checked
                  disabled
                  id="auto-match"
                />
                <label htmlFor="auto-match" className="cm-auto-label">
                  자동 게임 생성 활성화
                </label>
              </div>
            </div>

            {/* 좌우 패널 */}
            <div className="cm-main-panel-grid">
              {/* 왼쪽: 게임 목록 */}
              <div className="cm-game-rooms-card">
                <div className="cm-panel-header">
                  <Users style={{ width: 18, height: 18, marginRight: 5 }} />
                  <span>매칭이 완료된 게임</span>
                  <Badge color="gray">{games.length}</Badge>
                </div>
                <div className="cm-panel-desc">기존 게임에 참가하거나 새 게임방을 만들 수 있습니다</div>
                {games.map(room => (
                  <div key={room.gameId} className="cm-game-room-box">
                    <div className="cm-room-header-row">
                      <div>
                        <Badge color="gray">{gameTypeLabel[room.gameType]}</Badge>
                        {room.status === "대기중" && (
                          <Badge color="yellow">대기 중</Badge>
                        )}
                        {room.status === "진행중" && (
                          <Badge color="green">진행 중</Badge>
                        )}
                        {room.status === "종료됨" && (
                          <Badge color="red">종료</Badge>
                        )}
                        {room.status === "알수없음" && (
                          <Badge color="black">알수없음</Badge>
                        )}
                      </div>
                      <span className="cm-room-player-count">
                        {room.players.length}/{room.maxPlayers} 명
                      </span>
                    </div>
                    <div className="cm-players-list">
                      {room.players.map(player => (
                        <div key={player.id} className="cm-player-row">
                          <div className="cm-avatar">{player.name.split(" ").map(n => n[0]).join("")}</div>
                          <span className="cm-player-name">{player.name}</span>
                          <Badge color={rankColor[player.rankLevel]}>
                            {player.rankLevel}
                          </Badge>
                        </div>
                      ))}
                      {/* 상태별 버튼 */}
                      {room.status === "대기중" && (
                        <Button className="cm-join-btn cm-set-team-btn"
                          onClick={() => {
                            setModalRoom(room);
                            setTeamModalRoomId(room.gameId);
                            setTeamModalOpen(true);
                          }}>
                          팀 설정
                        </Button>
                      )}
                      {room.status === "대기중" && (
                        <Button className="cm-join-btn cm-game-start-btn"
                          onClick={() => {
                            handleStartGame(room.gameId);
                          }}>
                          게임 시작
                        </Button>
                      )}
                      {room.status === "진행중" && (
                        <Button className="cm-join-btn cm-game-finish-btn"
                          onClick={() => {
                            handleGameComplete(room.gameId);
                          }}>
                          게임 종료
                        </Button>
                      )}
                      {room.status === "종료됨" && (
                        <Button className="cm-join-btn cm-game-result-btn"
                          onClick={() => {
                            setModalRoom(room);
                            setModalOpen(true);
                          }}>
                          점수 입력
                        </Button>
                      )}
                    </div>
                    <div className="cm-room-created-at">
                      {room.createdBy} 님이 생성 · {room.createdAt.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* 오른쪽: 대기자 명단 */}
              <div className="cm-waitlist-card">
                {/* 수동 대기자 명단(위) */}
                <div>
                  <div className="cm-panel-header" style={{ alignItems: "center", gap: 12 }}>
                    <Users style={{ width: 18, height: 18, marginRight: 5 }} />
                    <span>수동 대기자 명단</span>
                    <Badge color="gray">{manualWaitlist.length}</Badge>
                    <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
                      {!isAdmin && (
                        <>
                          <Button className="cm-create-btn" onClick={handleManualRegister}>수동 매칭 등록</Button>
                          <Button className="cm-create-btn" onClick={handleCancelManualRegister}>매칭 등록 취소</Button>
                        </>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="cm-panel-desc">체크 후 선택 인원(2명=단식, 4명=복식)으로 방을 직접 만들 수 있습니다</div>
                  )}
                  <div className="cm-waitlist-list">
                    {manualWaitlist.map(player => (
                      <div className="cm-waitlist-row" key={player.id}>
                        {isAdmin && (
                          <input
                            type="checkbox"
                            checked={selected.includes(player.id)}
                            onChange={() =>
                              setSelected(selected.includes(player.id)
                                ? selected.filter(id => id !== player.id)
                                : [...selected, player.id])
                            }
                            style={{ marginRight: 8 }}
                          />
                        )}
                        <div className="cm-wait-avatar">{player.name.split(" ").map(n => n[0]).join("")}</div>
                        <span className="cm-wait-name">{player.name}</span>
                        <Badge color={rankColor[player.rankLevel]}>
                          {player.rankLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14 }}>
                    {isAdmin && (
                      <>
                        <Button
                          onClick={handleManualMatchCreate}
                          disabled={selected.length !== 2 && selected.length !== 4}
                          style={{
                            marginRight: 8,
                            background: '#e8e3fd',
                            color: '#6930c3',
                            borderRadius: 6
                          }}
                        >
                          게임 매칭
                        </Button>
                        <Button
                          onClick={handleManualMatchCancel}
                          style={{
                            background: '#ececec',
                            color: '#555',
                            borderRadius: 6
                          }}
                        >
                          선택 취소
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <hr style={{ margin: "28px 0" }} />
                {/* 자동 대기자 명단(아래) */}
                <div>
                  <div className="cm-panel-header" style={{ alignItems: "center", gap: 12 }}>
                    <Users style={{ width: 18, height: 18, marginRight: 5 }} />
                    <span>자동 대기자 명단</span>
                    <Badge color="gray">{autoWaitlist.length}</Badge>
                    <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
                      {!isAdmin && (
                        <>
                          <Button className="cm-create-btn" onClick={handleAutoRegister}>자동 매칭 등록</Button>
                          <Button className="cm-create-btn" onClick={handleCancelAutoRegister}>매칭 등록 취소</Button>
                        </>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="cm-panel-desc">아래 명단은 자동으로 방이 생성됩니다</div>
                  )}
                  <div className="cm-waitlist-list">
                    {autoWaitlist.map(player => (
                      <div className="cm-waitlist-row" key={player.id}>
                        <div className="cm-wait-avatar">{player.name.split(" ").map(n => n[0]).join("")}</div>
                        <span className="cm-wait-name">{player.name}</span>
                        <Badge color={rankColor[player.rankLevel]}>
                          {player.rankLevel}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 14, display: "flex", justifyContent: "center"
                  }}>
                    {isAdmin && (
                      <button
                        className="cm-create-btn"
                        onClick={handleStartAutoMatch}
                      >
                        자동 매칭 시작
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ======== 모달들 ======== */}
        <SelectTypeModal
          open={modalTypeOpen}
          onClose={() => setModalTypeOpen(false)}
          onSelect={handleAddWaitlistByType}
        />

        <GameResultModal
          visible={modalOpen}
          room={modalRoom}
          onClose={() => setModalOpen(false)}
          onResultSaved={() => {
            fetchGamelist();
            fetchManualWaitlist();
            fetchAutoWaitlist();
          }}
          submitGameResult={submitGameResult}
        />

        <TeamSettingModal
          visible={teamModalOpen}
          onClose={() => setTeamModalOpen(false)}
          players={modalRoom?.players || []}
          gameId={teamModalRoomId}
          onSetTeams={(teamA, teamB) => {
            fetchGamelist();
          }}
        />
        
        {isAdmin ? (
          <div style={{ display: "flex", justifyContent: "center", margin: "3px 0" }}>
            <Button
              className="cm-delete-button"
              onClick={async () => {
                try {
                  await axios.delete(
                    `/api/game-room/${roomId}`,
                    { withCredentials: true }
                  );
                  alert("게임방이 삭제되었습니다.");
                  navigate("/current-matching");
                } catch (error) {
                  console.error("게임방 삭제 실패", error);
                  alert("게임방 삭제 중 오류가 발생했습니다.");
                }
              }}
            >
              게임방 삭제
            </Button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", margin: "3px 0" }}>
            <Button
              className="cm-exit-button"
              onClick={async () => {
                try {
                  await axios.delete(`
                    /api/users/${currentUserId}/game-room`,
                    { withCredentials: true }
                  );
                  alert("게임방에서 나갔습니다.");
                  navigate("/current-matching");
                } catch (error) {
                  console.error("게임방 나가기 실패", error);
                  alert("게임방 나가기 중 오류가 발생했습니다.");
                }
              }}
            >
              게임방 나가기
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
