import React from 'react'
import Header from './components/Header'
import Main from './components/Main'
import Attendance from './components/Attendance'
import ChallengeQuicklink from './components/ChallengeQuicklink'
import RankingQuicklink from './components/RankingQuicklink'
import ShopQuicklink from './components/ShopQuicklink'
import CommunityQuicklink from './components/CommunityQuicklink'
import LoginView from './components/LoginView'
import SignupView from './components/SignupView'

export default function App() {
  return (
    <div>
      <Header />
      <div className="wrap">
        <Main />
        <ChallengeQuicklink />
        <RankingQuicklink />
        <ShopQuicklink />
        <CommunityQuicklink />
        <Attendance />
      </div>

      <LoginView />
      <SignupView />
    </div>
  )
}
