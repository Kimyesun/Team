import React from 'react'

export default function ShopQuicklink(){
  return (
    <div className="shop-quicklink">
      <div className="shop-header">
        <h2>Item Shop</h2>
        <p>포인트를 모아서 여러가지 아이템을 구매하세요!</p>
      </div>
      <div className="shop-content">
        <div className="shop-slider-container">
          <button className="shop-nav prev">◀</button>
          <div className="shop-items-wrapper">
            <div className="shop-item small"><div className="item-circle"/></div>
            <div className="shop-item medium"><div className="item-circle"/></div>
            <div className="shop-item active"><div className="item-circle"/></div>
          </div>
          <button className="shop-nav next">▶</button>
        </div>
      </div>
    </div>
  )
}
