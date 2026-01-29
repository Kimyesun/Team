import React from 'react'

export default function CommunityQuicklink(){
  return (
    <div className="community-quicklink">
      <div className="community-header">
        <div className="header-titles">
          <h2>Latest<br/>Community</h2>
          <p>인기 글에 등록되어 포인트를 노리세요!</p>
        </div>
      </div>
      <div className="community-container">
        <div className="community-cards-wrapper">
          <div className="comm-card">
            <div className="comm-tag-row"><span className="comm-tag">Q&A</span></div>
            <h3 className="comm-title">미적분 문제 질문이요!</h3>
            <p className="comm-desc">치환적분 문제인데 도와주세요</p>
          </div>
        </div>
      </div>
    </div>
  )
}
