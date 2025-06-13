import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux/store'; 
import { loginSuccess } from './redux/authSlice';

// 웹 브라우저 탭 제목에 들어갈 문구를 배열로 정의
const details = [
  "오늘 배드민턴 한 판 어때?",
  "함께할 때 더 즐거운 배드민턴",
  "배드민턴을 함께하는 가장 쉬운 방법",
  "셔틀플레이에서 실력도, 인연도 쌓자",
  "매칭부터 커뮤니티까지, 배드민턴의 모든 것"
];

// 랜덤으로 문구를 선택하여 탭 제목에 반영
const idx = Math.floor(Math.random() * details.length);
document.title = "셔틀플레이 | " + details[idx];

const savedUser = localStorage.getItem('user');
if (savedUser) {
  const parsed = JSON.parse(savedUser);
  if (parsed.userId) {
    store.dispatch(loginSuccess({ userId: parsed.userId }));
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App/>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
