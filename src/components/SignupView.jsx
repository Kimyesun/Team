import React from 'react'

export default function SignupView(){
  return (
    <div id="signup-view" className="login-view hidden">
      <div className="login-container-view">
        <div className="input-group"><label htmlFor="signup-id-view">아이디</label><input type="text" id="signup-id-view" placeholder="아이디를 입력해주세요."/></div>
        <div className="input-group"><label htmlFor="signup-pw-view">비밀번호</label><input type="password" id="signup-pw-view" placeholder="비밀번호를 입력해주세요."/></div>
        <div className="input-group"><label htmlFor="signup-pw-confirm-view">비밀번호 확인</label><input type="password" id="signup-pw-confirm-view" placeholder="비밀번호를 다시 입력해주세요."/></div>
        <div className="button-group"><button className="login-btn">회원가입</button></div>
      </div>
    </div>
  )
}
