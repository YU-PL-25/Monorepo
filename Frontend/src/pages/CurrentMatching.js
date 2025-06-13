import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CurrentMatching.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

function CurrentMatching() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [gameRooms, setGameRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const roomsPerPage = 5;
  const indexOfLast = currentPage * roomsPerPage;
  const indexOfFirst = indexOfLast - roomsPerPage;
  const currentRooms = gameRooms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(gameRooms.length / roomsPerPage));
  const [formData, setFormData] = useState({
    title: '',
    userLocation: '',
    latitude: '',
    longitude: '',
    courtName: '',
    courtAddress: ''
  });

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/game-room', { withCredentials: true });
      if (response.data.status === 200) {
        setGameRooms(response.data.data);
      }
    } catch (err) {
      console.error('게임방 목록 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();
  const location = useLocation();

  const handleCreate = async () => {
    if (!isAuthenticated || !user?.userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    const payload = {
      masterId: user?.userId,
      title: formData.title, // 백엔드 수정 필요
      location: {
        userLocation: formData.userLocation,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        courtName: formData.courtName,
        courtAddress: formData.courtAddress
      }
    };

    try {
      const res = await axios.post('/api/game-room/current-matching', payload, {
        withCredentials: true
      });

      if (res.data.status === 200) {
        alert("방이 성공적으로 생성되었습니다.");
        setFormData({
          title: '',
          userLocation: '',
          latitude: '',
          longitude: '',
          courtName: '',
          courtAddress: ''
        });
        setShowModal(false);
        await fetchRooms();

        if (res.data.gameRoomId) {
          navigate(`/current-matching/gameroom/${res.data.gameRoomId}`);
        }
      } else {
        alert("방 생성 실패: " + res.data.message);
      }
    } catch (err) {
      console.error("방 생성 오류:", err);
      alert("방 생성 중 오류가 발생했습니다.");
    }
  };

  const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="cml-wrapper">
      <Header/>
      <div className="cml-content">
        <div className="cml-body-wrapper">
          <div className="cml-header-box">
            <div className="cml-header-left">
              <h2 className="cml-title">현장 매칭 모드</h2>
              <p className="cml-subtitle">현장에서 원하는 방에 들어가 게임 매칭을 진행하세요.</p>
            </div>
          </div>

          <div className="cml-room-list-box">
            <div className="cml-room-list-header">
              <button className="cml-create-room-btn" onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login', { state: { from: location } });
                  return;
                }

                if (!user?.userId) {
                  alert("로그인 정보가 불완전합니다. 새로고침 후 다시 시도해주세요.");
                  return;
                }

                setShowModal(true);
              }}>
                + 방 생성
              </button>
            </div>

            <div className="cml-room-list">
              {currentRooms.map((room) => {
                const alreadyJoined = room.participants?.some(p => p.userId === user?.userId);
                return (
                  <div className="cml-room-card" key={room.gameRoomId}>
                    <div className="cml-room-info">
                      <h3>{room.title}</h3>
                      <p>현재 인원: {room.participantCount ?? (room.participants?.length || 0)}명</p>
                      <p>
                        {room.locationName} · {room.locationAddress}
                      </p>
                      <p></p>
                      <p></p>
                      <p>{room.games?.[0]?.date && <> {room.games[0].date}</>}</p>
                    </div>
                    <div className="cml-room-actions">
                      {alreadyJoined ? (
                        <button
                          className="cml-join-btn"
                          onClick={() => navigate(`/current-matching/gameroom/${room.gameRoomId}`)}>
                          게임방 조회
                        </button>
                      ) : (
                        <button
                          className="cml-join-btn"
                          onClick={async () => {
                            try {
                              const res = await axios.post(
                                `/api/rooms/${room.gameRoomId}/join`,
                                { userId: user?.userId },
                                { withCredentials: true }
                              );

                              if (res.data.status === 200) {
                                alert('참가 요청 성공!');
                                navigate(`/current-matching/gameroom/${room.gameRoomId}`);
                              } else {
                                alert(res.data.message || '참가 요청 실패');
                              }
                            } catch (err) {
                              alert('참가 요청 중 오류가 발생했습니다.');
                              console.error(err);
                            }
                          }}>
                          방 참가
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cml-pagination">
              <button onClick={handlePrev} disabled={currentPage === 1}>이전</button>
              <span>{currentPage} / {totalPages}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>다음</button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>

      {showModal && (
        <div className="cml-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="cml-modal" onClick={(e) => e.stopPropagation()}>
            <h3>현장 게임방 생성</h3>
            <input name="title" placeholder="게임방 제목" value={formData.title} onChange={handleInputChange}/>
            <input name="userLocation" placeholder="지역명" value={formData.userLocation} onChange={handleInputChange}/>
            <input name="latitude" placeholder="위도" value={formData.latitude} onChange={handleInputChange}/>
            <input name="longitude" placeholder="경도" value={formData.longitude} onChange={handleInputChange}/>
            <input name="courtName" placeholder="체육관 이름" value={formData.courtName} onChange={handleInputChange}/>
            <input name="courtAddress" placeholder="체육관 주소" value={formData.courtAddress} onChange={handleInputChange}/>
            <button onClick={handleCreate}>방 생성</button>
            <button className="cml-close-btn" onClick={() => setShowModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentMatching;
