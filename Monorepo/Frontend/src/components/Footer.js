import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="footer-left">
          <a href="#!">이용약관</a>
          <a href="#!">개인정보처리방침</a>
          <a href="#!">문의하기</a>
        </div>

        <div className="footer-right">
          <a href="#!" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
          <a href="#!" aria-label="X(Twitter)"><i className="bi bi-twitter-x"></i></a>
          <a href="#!" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
          <a href="#!" aria-label="Threads"><i className="bi bi-threads"></i></a>
        </div>
      </div>

      <hr className="footer-divider"/>

      <div className="footer-bottom">
        © 2025 ShuttlePlay. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
