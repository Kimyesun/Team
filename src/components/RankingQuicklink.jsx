import React from 'react'

export default function RankingQuicklink(){
  return (
    <div className="ranking-quicklink">
      <h2 className="ranking-quicklink-title">Personal<br/>Ranking</h2>
      <div className="ranking-quicklink-container">
        <div className="ranking-quicklink-arrow"/>
        <div className="ranking-quicklink-list left">
          <div className="quick-rank-card"><div className="rank-num">1</div><div className="rank-profile"><div className="profile-img"/><span className="name">김예선</span></div><div className="rank-score"><span className="label">점수</span><span className="value">4,893</span></div></div>
        </div>
        <div className="ranking-quicklink-list right">
        </div>
      </div>
    </div>
  )
}
