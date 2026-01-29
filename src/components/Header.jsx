import React from 'react'

export default function Header(){
  return (
    <div className="header">
      <div className="logo">
        <img src="/img/logo.png" alt="Stufit Logo" />
      </div>
      <div className="nav">
        <a href="#" id="attendance-link">출석체크</a>
        <a href="#" id="challenge-link">챌린지</a>
        <a href="#" id="ranking-link">랭킹</a>
        <a href="#" id="community-link">커뮤니티</a>
        <a href="#">상점</a>
      </div>
      <div className="auth">
        <a href="#" id="login-link">로그인</a> | <a href="#" id="signup-link">회원가입</a>
      </div>
    </div>
  )
}
