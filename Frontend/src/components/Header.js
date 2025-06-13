import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import '../styles/Header.css';
import logoImage from '../assets/shuttleplay_main_logo.png';
import axios from 'axios';

function Header() {
  const { isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      dispatch(logout());
      setDropdownOpen(false);
      navigate('/main');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/main">
          <img src={logoImage} alt="ShuttlePlay Logo" className="logo-image"/>
        </Link>
      </div>

      <nav className="header-center">
        <ul className="nav-menu">
          <li><Link to="/pre-matching">사전 매칭</Link></li>
          <li><Link to="/current-matching">현장 매칭</Link></li>
          <li><Link to="/competition">대회 관리</Link></li>
          <li><Link to="/reservation">구장 예약</Link></li>
          <li><Link to="/club">모임 관리</Link></li>
          <li><Link to="/community">커뮤니티</Link></li>
        </ul>
      </nav>

      <div className="header-right">
        <i className="bi bi-chat-dots" title="채팅"></i>
        <i className="bi bi-bell" title="알림"></i>

        {!isAuthenticated ? (
          <Link to="/login" className="header-login-link">
            <button className="header-login-btn">로그인</button>
          </Link>
        ) : (
          <div className="profile-container" ref={dropdownRef}>
            <button className="profile-btn" onClick={toggleDropdown}>
              <i className="bi bi-person-circle"></i>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/mypage" className="dropdown-item" onClick={() => setDropdownOpen(false)}>마이페이지</Link>
                <button className="dropdown-item logout-item" onClick={handleLogout}>로그아웃</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
