import { Link } from 'react-router-dom';
import '../styles/RegisterSuccess.css';
import logo from '../assets/shuttleplay_main_logo.png';

function RegisterSuccess() {
  return (
    <div className="success-page">
      <div className="success-wrapper">
        <Link to="/main" className="success-main-link">
          <img src={logo} alt="로고" className="logo-img"/>
        </Link>
        <h2 className="success-title">회원가입이 완료되었습니다!</h2>
        <p className="success-text">로그인 후 셔틀플레이를 이용해 보세요.</p>
        <Link to="/login" className="success-btn">로그인</Link>
      </div>
    </div>
  );
}

export default RegisterSuccess;
