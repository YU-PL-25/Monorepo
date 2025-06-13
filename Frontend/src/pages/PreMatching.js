import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PreMatching.css';
import logo from '../assets/shuttleplay_main_logo.png';
import AutoGameRoomMatching from './AutoGameRoomMatching';
import { useSelector } from 'react-redux';
import axios from 'axios';

// 방 생성 모달
function PreMatchingCreateRoomModal({ open, onClose, onCreate }) {
  const [mode, setMode] = useState('구장');

  const [formGym, setFormGym] = useState({
    venue: '', address: '', latitude: '', longitude: '',
    courtName: '', courtAddress: '', date: '', time: '',
  });

  const [formLocal, setFormLocal] = useState({
    location: '', latitude: '', longitude: '', date: '', time: '',
  });

  useEffect(() => {
    if (open) {
      setMode('구장');
      setFormGym ({ venue:'', address:'', latitude:'', longitude:'', courtName:'', courtAddress:'', date:'', time:'' });
      setFormLocal({ location:'', latitude:'', longitude:'', date:'', time:'' });
    }
  }, [open]);

  const handleChangeGym = e => setFormGym (p=>({...p,[e.target.name]:e.target.value}));
  const handleChangeLocal = e => setFormLocal(p=>({...p,[e.target.name]:e.target.value}));

  const handleSubmit = e => {
    e.preventDefault();
    mode === '구장'
      ? onCreate({ ...formGym,  mode:'구장매칭' })
      : onCreate({ ...formLocal,mode:'동네매칭' });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="pre-modal-backdrop">
      <div className="pre-modal">
        <div style={{display:'flex',gap:12,marginBottom:20,justifyContent:'center'}}>
          <button className={`pre-modal-mode-btn${mode==='구장'?' selected':''}`} onClick={()=>setMode('구장')}>
            구장 게임방 생성
          </button>
          <button className={`pre-modal-mode-btn${mode==='동네'?' selected':''}`} onClick={()=>setMode('동네')}>
            동네 게임방 생성
          </button>
        </div>

        <form className="pre-modal-form" onSubmit={handleSubmit}>
          {mode==='구장' ? (
            <>
              <input name="venue" placeholder="장소명" value={formGym.venue} onChange={handleChangeGym} required/>
              <input name="address" placeholder="지역명" value={formGym.address} onChange={handleChangeGym} required/>
              <input name="latitude" placeholder="위도" value={formGym.latitude} onChange={handleChangeGym} required/>
              <input name="longitude" placeholder="경도" value={formGym.longitude} onChange={handleChangeGym} required/>
              <input name="courtName" placeholder="체육관 이름" value={formGym.courtName} onChange={handleChangeGym} required/>
              <input name="courtAddress" placeholder="체육관 주소" value={formGym.courtAddress} onChange={handleChangeGym} required/>
              <input name="date" type="date" placeholder="날짜" value={formGym.date} onChange={handleChangeGym} required/>
              <input name="time" type="time" placeholder="시간" value={formGym.time} onChange={handleChangeGym} required/>
            </>
          ) : (
            <>
              <input name="location" placeholder="동네(지역명)" value={formLocal.location} onChange={handleChangeLocal} required/>
              <input name="latitude" placeholder="위도" value={formLocal.latitude} onChange={handleChangeLocal} required/>
              <input name="longitude" placeholder="경도" value={formLocal.longitude} onChange={handleChangeLocal} required/>
              <input name="date" type="date" placeholder="날짜" value={formLocal.date} onChange={handleChangeLocal} required/>
              <input name="time" type="time" placeholder="시간" value={formLocal.time} onChange={handleChangeLocal} required/>
            </>
          )}
          <button className="pre-modal-create-btn" type="submit">방 생성</button>
          <button className="pre-modal-cancel-btn" type="button" onClick={onClose}>닫기</button>
        </form>
      </div>
    </div>
  );
}

// 메인 컴포넌트
function PreMatching() {
  const navigate = useNavigate();
  const userId = useSelector(s=>s.auth.user?.userId);
  const [step, setStep] = useState('selectMode');
  const [selectedMode, setSelectedMode] = useState('구장매칭');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [roomList, setRoomList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 구장/동네 옵션 및 location 값 하드코딩
  const gymOptions = [
    {
      label: '영남대학교 이희건 기념관',
      value: '영남대학교 이희건 기념관',
      courtName: '이희건 기념관',
      courtAddress: '경북 경산시 대학로 280',
      latitude: '35.8835',
      longitude: '128.8172',
      address: '경북 경산시 대학로 280'
    },
    {
      label: '경산 실내 체육관',
      value: '경산 실내 체육관',
      courtName: '경산 실내 체육관',
      courtAddress: '경북 경산시 중앙로 246',
      latitude: '35.8251',
      longitude: '128.7376',
      address: '경북 경산시 중앙로 246'
    }
  ];
  const localOptions = [
    {
      label: '경산시 조영동',
      value: '경산시 조영동',
      location: '경산시 조영동',
      courtName: '경산시 조영동',
      courtAddress: '경산시 조영동',
      latitude: '35.8381',
      longitude: '128.7552'
    },
    {
      label: '경산시 압량읍',
      value: '경산시 압량읍',
      location: '경산시 압량읍',
      courtName: '경산시 압량읍',
      courtAddress: '경산시 압량읍',
      latitude: '35.8999',
      longitude: '128.7962'
    }
  ];

  // 장소 선택 시 location 값 자동 세팅
  const [selectedLocation, setSelectedLocation] = useState({});

  useEffect(() => {
    if (selectedMode === '구장매칭') {
      const found = gymOptions.find(opt => opt.value === selectedVenue);
      setSelectedLocation(found || {});
    } else {
      const found = localOptions.find(opt => opt.value === selectedVenue);
      setSelectedLocation(found || {});
    }
  }, [selectedVenue, selectedMode]);

  const handleFindRooms = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRoomList([]);
    try {
      let url = '';
      let body = {};
      if (selectedMode === '구장매칭') {
        url = `/api/match/manual/rooms/gym?userId=${userId}`;
        body = {
          location: {
            courtName: selectedLocation.courtName || '',
            courtAddress: selectedLocation.courtAddress || '',
            latitude: selectedLocation.latitude || '',
            longitude: selectedLocation.longitude || '',
            address: selectedLocation.address || ''
          },
          date: selectedDate,
          time: selectedTime,
        };
      } else {
        url = `/api/match/manual/rooms/location?userId=${userId}`;
        body = {
          location: {
            courtName: selectedLocation.courtName || '',
            courtAddress: selectedLocation.courtAddress || '',
            latitude: selectedLocation.latitude || '',
            longitude: selectedLocation.longitude || '',
            // 명세상 location(이름)도 같이 보냄
            location: selectedLocation.location || ''
          },
          date: selectedDate,
          time: selectedTime,
        };
      }
      const res = await axios.post(url, body, {
        headers: { userId },
        withCredentials: true
      });
      setRoomList(res.data.rooms || []);
    } catch (err) {
      setError('게임방 조회에 실패했습니다.');
    }
    setLoading(false);
  };

  // 시간 옵션
  const timeOptions = [];
  for(let h=0;h<24;h++){
    timeOptions.push(`${String(h).padStart(2,'0')}:00`);
    timeOptions.push(`${String(h).padStart(2,'0')}:30`);
  }

  const getBtnClass = active => 'pre-select-mode-btn' + (active ? ' pre-select-active' : '');

  // 렌더링
  return (
    <div className="pre-matching-wrapper">
      <Header/>

      <div className="pre-body-center">
        <PreMatchingCreateRoomModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={() => {}}
        />

        {/* 처음 나오는 자동/수동 매칭 선택 카드 */}
        {step === 'selectMode' && (
          <div className="pre-select-mode-card">
            <img src={logo} alt="ShuttlePlay 로고" className="pre-card-logo"/>
            <div className="pre-card-content">
              <h2>매칭 방식을 선택해주세요!</h2>
              <div className="pre-select-mode-buttons">
                <button
                  className={getBtnClass(step === 'autoInput')}
                  onClick={() => setStep('autoInput')}
                >자동 매칭</button>
                <button
                  className={getBtnClass(step === 'filter')}
                  onClick={() => setStep('filter')}
                >수동 매칭</button>
              </div>
            </div>
          </div>
        )}

        {/* 자동 매칭 클릭 시 넘어가는 부분 */}
        {step === 'autoInput' && (
          <AutoGameRoomMatching onClose={() => setStep('selectMode')}/>
        )}

        {/* 수동 매칭 필터 */}
        {step === 'filter' && (
          <>
            <div className="pre-filter-bar">
              <div
                className="pre-filter-items"
                style={{display:'flex',gap:20,flexWrap:'wrap',alignItems:'center'}}
              >
                <div className="pre-filter-item">
                  <span>매칭유형</span>
                  <select value={selectedMode} onChange={e=>{
                    setSelectedMode(e.target.value);
                    setSelectedVenue('');
                  }}>
                    <option value="구장매칭">구장매칭</option>
                    <option value="동네매칭">동네매칭</option>
                  </select>
                </div>
                <div className="pre-filter-item">
                  <span>장소</span>
                  <select
                    value={selectedVenue}
                    onChange={e=>setSelectedVenue(e.target.value)}
                  >
                    <option value="">장소를 선택하세요</option>
                    {selectedMode === '구장매칭'
                      ? gymOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))
                      : localOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))
                    }
                  </select>
                </div>
                <div className="pre-filter-item">
                  <span>날짜</span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e=>setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="pre-filter-item">
                  <span>시간</span>
                  <select value={selectedTime} onChange={e=>setSelectedTime(e.target.value)}>
                    {timeOptions.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{display:'flex',gap:10}}>
                  <button
                    className="pre-filter-apply-btn"
                    onClick={handleFindRooms}
                  >게임방 리스트 찾기</button>
                  <button
                    className="pre-create-btn"
                    onClick={() => setCreateModalOpen(true)}
                  >방 생성</button>
                </div>
              </div>
            </div>
            {/* 게임방 리스트 카드 그리드 */}
            <div style={{width:'100%'}}>
              {loading && (
                <div className="auto-message">게임방을 불러오는 중...</div>
              )}
              {error && (
                <div className="auto-message" style={{color:'red'}}>{error}</div>
              )}
              {!loading && !error && roomList.length === 0 && (
                <div className="auto-message">조건에 맞는 게임방이 없습니다.</div>
              )}
              {!loading && !error && roomList.length > 0 && (
                <div className="pre-card-grid">
                  {roomList.map((room, idx) => (
                    <div className="pre-card" key={room.roomId || idx}>
                      <div className="pre-card-thumbnail">
                        <span className="pre-thumbnail-text">
                          {room.mode === '구장매칭' ? '🏸 구장 : ' : '🏠 동네 : '} {room.title ? room.title : (room.mode === '구장매칭' ? '구장' : '동네')}
                        </span>
                      </div>
                      <div className="pre-card-body">
                        <h4>{room.locationName || '장소 미정'}</h4>
                        <div className="pre-alt-info">
                          <div><span className="label">날짜:</span> {selectedDate}</div>
                          <div><span className="label">시간:</span> {selectedTime}</div>
                        </div>
                        <div className="pre-card-bottom">
                          <button
                            className="pre-enter-btn"
                            onClick={() => navigate(`/manual-room/${room.roomId}`)}
                          >입장하기</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{marginTop:'auto'}}><Footer/></div>
    </div>
  );
}

export default PreMatching;
