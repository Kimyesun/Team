import React from 'react'

export default function Attendance(){
  return (
    <div className="attendance-section hidden">
      <div className="attendance-header">
        <h1>출석체크</h1>
        <p>7일 연속 출석시 400포인트 지급!</p>
      </div>
      <div className="attendance-container">
        <div className="attendance-board">
          <div className="attendance-days">
            <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
          </div>
          <div className="attendance-cards">
            {[100,120,140,160,180,200,220].map((p,i)=> (
              <div className="att-card" key={i}>
                <span className="label">일일 포인트</span>
                <span className="point">{p}P</span>
              </div>
            ))}
          </div>
        </div>
        <div className="attendance-footer">총 연속 출석체크일 수 : <span id="attendance-count">0</span>일</div>
      </div>
    </div>
  )
}
