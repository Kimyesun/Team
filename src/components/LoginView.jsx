import React from 'react'

export default function LoginView(){
  return (
    <div id="login-view" className="login-view hidden">
      <div className="login-container-view">
        <div className="input-group"><label htmlFor="login-id-view">아이디</label><input type="text" id="login-id-view" placeholder="아이디를 입력해주세요."/></div>
        <div className="input-group"><label htmlFor="login-pw-view">비밀번호</label><input type="password" id="login-pw-view" placeholder="비밀번호를 입력해주세요."/></div>
        <div className="button-group"><button className="login-btn">로그인</button><button className="signup-btn">회원가입</button></div>
      </div>
    </div>
  )
}
