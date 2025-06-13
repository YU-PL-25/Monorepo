"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../styles/AutoGameRoomMatching.css";
import axios from "axios";

// 실제 서비스 DB에 등록된 유저의 id로 교체!
const userId = 1; // 예시, 추후 로그인 정보와 연동 가능

const sampleVenues = [
  {
    courtName: "downtown",
    courtAddress: "경상북도 경산시 옥산로 120",
    latitude: 35.816742,
    longitude: 128.742983,
  },
  {
    courtName: "삼성현공원",
    courtAddress: "경산시 삼성현로 45",
    latitude: 35.831201,
    longitude: 128.73012,
  },
  {
    courtName: "영남대 실내체육관",
    courtAddress: "경북 경산시 대학로 280",
    latitude: 35.883733,
    longitude: 128.813515,
  },
];

const AutoGameRoomMatching = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [matchType, setMatchType] = useState("Neighborhood");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedTime, setSelectedTime] = useState("18:00");
  const [selectedVenue, setSelectedVenue] = useState(sampleVenues[0].courtName);
  const [maxDistance] = useState(300);
  const [selectedGameType, setSelectedGameType] = useState("Doubles");
  const [autoGenerationEnabled, setAutoGenerationEnabled] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);
  const [matchedOpponent, setMatchedOpponent] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const selectedVenueObj = sampleVenues.find((v) => v.courtName === selectedVenue);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 30분 단위 옵션
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, "0")}:00`);
    timeOptions.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  const customTimeOptions = timeOptions.map((time) => ({ value: time, label: time }));

  // --------------- 메인 로직: 큐 등록 -> 매칭 요청 ---------------
  const handleMatching = async () => {
    setIsModalOpen(true);
    setMatchSuccess(false);
    setMatchedOpponent(null);

    const requiredMatchCount = selectedGameType === "Singles" ? 2 : 4;

    const queuePayload = {
      date: selectedDate,
      time: selectedTime,
      location: {
        courtName: selectedVenueObj.courtName,
        courtAddress: selectedVenueObj.courtAddress,
        latitude: selectedVenueObj.latitude,
        longitude: selectedVenueObj.longitude,
      },
      requiredMatchCount,
    };

    try {
      // 1. 큐 등록(사전)
      await axios.post(
        `/api/match/auto/queue/location-preGym?userId=${userId}`,
        queuePayload
      );

      // 2. 매칭 요청
      let matchApiUrl = "";
      if (matchType === "Neighborhood") {
        matchApiUrl = `/api/match/auto/rooms/location?userId=${userId}`;
      } else {
        matchApiUrl = `/api/match/auto/rooms/gym?userId=${userId}`;
      }

      const res = await axios.post(matchApiUrl);

      setMatchedOpponent(res.data.userIds || []);
      setMatchSuccess(true);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch (err) {
      setMatchSuccess(false);
      setMatchedOpponent(null);

      let errMsg = "큐 등록 또는 매칭에 실패했습니다. 다시 시도해주세요.";
      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          errMsg = err.response.data;
        } else if (err.response.data.message) {
          errMsg = err.response.data.message;
        }
      }
      alert(errMsg);
    }
  };

  // 큐 등록 취소 (API 호출)
  const handleQueueCancel = async () => {
    try {
      await axios.delete(`/api/match/auto/queue?userId=${userId}`);
      alert("큐 등록이 취소되었습니다.");
      window.location.href = "/pre-matching";
    } catch (err) {
      let errMsg = "큐 등록 취소에 실패했습니다.";
      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          errMsg = err.response.data;
        } else if (err.response.data.message) {
          errMsg = err.response.data.message;
        }
      }
      alert(errMsg);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    window.location.href = "/pre-matching";
  };

  const handleLeave = () => {
    window.location.href = "/pre-matching";
  };

  return (
    <div className="agr-auto-matching-container">
      <div className="agr-auto-matching-header">
        <h2>자동 GameRoom 매칭</h2>
        <div className="agr-auto-matching-time">🕐 {currentTime.toLocaleTimeString()}</div>
      </div>
      <label className="agr-auto-matching-checkbox">
        <input
          type="checkbox"
          checked={autoGenerationEnabled}
          onChange={(e) => setAutoGenerationEnabled(e.target.checked)}
        />
        자동 게임방 생성 허용
      </label>
      <div className="agr-match-type-buttons">
        <button
          className={`agr-match-type-button ${matchType === "Neighborhood" ? "active" : ""}`}
          onClick={() => setMatchType("Neighborhood")}
        >
          동네매칭
        </button>
        <button
          className={`agr-match-type-button ${matchType === "Court" ? "active" : ""}`}
          onClick={() => setMatchType("Court")}
        >
          구장매칭
        </button>
      </div>

      <div className="agr-auto-matching-grid">
        <div>
          <label className="agr-auto-matching-label">날짜</label>
          <input
            type="date"
            className="agr-auto-matching-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <label className="agr-auto-matching-label">시간</label>
          <Select
            options={customTimeOptions}
            value={customTimeOptions.find((opt) => opt.value === selectedTime)}
            onChange={(option) => setSelectedTime(option.value)}
            menuPlacement="bottom"
            styles={{
              container: (provided) => ({ ...provided, width: "180px" }),
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
              control: (provided) => ({ ...provided, minHeight: "38px" }),
            }}
            placeholder="시간 선택"
            isSearchable={false}
          />
        </div>
        <div>
          <label className="agr-auto-matching-label">장소</label>
          <select
            className="agr-auto-matching-select"
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
          >
            {sampleVenues.map((venue, idx) => (
              <option key={idx} value={venue.courtName}>
                {venue.courtName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="agr-auto-matching-label">최대 거리: {maxDistance}m</label>
          <input
            type="range"
            min="50"
            max="300"
            step="50"
            value={maxDistance}
            className="agr-auto-matching-input"
            disabled
          />
        </div>
        <div>
          <label className="agr-auto-matching-label">게임 유형</label>
          <select
            className="agr-auto-matching-select"
            value={selectedGameType}
            onChange={(e) => setSelectedGameType(e.target.value)}
          >
            <option value="Singles">단식 (1v1)</option>
            <option value="Doubles">복식 (2v2)</option>
          </select>
        </div>
      </div>

      {/* 버튼 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "20px" }}>
        <button className="agr-create-button" onClick={handleMatching}>
          GameRoom 생성
        </button>
        <button className="agr-leave-button" onClick={handleLeave}>
          나가기
        </button>
      </div>

      <div className="agr-auto-matching-info">
        <p>💡 조건에 맞는 게임방이 자동으로 생성됩니다.</p>
        <ul>
          <li>선택한 날짜와 시간대 동일한 사용자와 매칭</li>
          <li>300m 이내의 위치에서 매칭</li>
          <li>선택한 게임 유형에 따라 인원이 충족되면 자동 생성</li>
        </ul>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="agr-modal-overlay">
          <div className="agr-modal-content">
            <h3>📋 선택한 정보</h3>
            <p>날짜: {selectedDate}</p>
            <p>시간: {selectedTime}</p>
            <p>장소: {selectedVenueObj.courtName}</p>
            <p>주소: {selectedVenueObj.courtAddress}</p>
            <p>게임 유형: {selectedGameType === "Singles" ? "단식" : "복식"}</p>
            <hr style={{ margin: "16px 0" }} />
            {matchSuccess && matchedOpponent ? (
              <>
                <h4>🧑‍🤝‍🧑 매칭 상대</h4>
                <p>{JSON.stringify(matchedOpponent)}</p>
              </>
            ) : (
              <p>✨ 매칭 상대 정보를 불러오는 중...</p>
            )}
            <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginTop: "24px" }}>
              <button className="agr-close-button" onClick={closeModal}>
                닫기
              </button>
              <button className="agr-close-button" onClick={handleQueueCancel}>
                큐 등록 취소
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="agr-success-popup">🎉 매칭이 성공되었습니다!</div>
      )}
    </div>
  );
};

export default AutoGameRoomMatching;
